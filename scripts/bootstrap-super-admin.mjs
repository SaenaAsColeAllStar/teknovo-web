#!/usr/bin/env node
/**
 * Bootstrap Super Admin via Clerk Backend API.
 *
 * Usage:
 *   node --env-file=.env.local scripts/bootstrap-super-admin.mjs [email]
 *
 * Default email: diegocole234@gmail.com
 * Requires CLERK_SECRET_KEY in env / .env.local (never commit secrets).
 *
 * Behavior:
 * - If user exists → set publicMetadata.role = "admin"
 * - If not → create invitation with publicMetadata.role = "admin"
 */
const EMAIL = (process.argv[2] || "diegocole234@gmail.com").trim().toLowerCase();
const SECRET = process.env.CLERK_SECRET_KEY;
const API = "https://api.clerk.com/v1";

if (!SECRET || SECRET.startsWith("GANTI_")) {
  console.error(
    "CLERK_SECRET_KEY missing or placeholder. Set it in .env.local then re-run:\n" +
      "  node --env-file=.env.local scripts/bootstrap-super-admin.mjs",
  );
  process.exit(1);
}

async function clerk(path, init = {}) {
  const res = await fetch(`${API}${path}`, {
    ...init,
    headers: {
      Authorization: `Bearer ${SECRET}`,
      "Content-Type": "application/json",
      ...(init.headers || {}),
    },
  });
  const text = await res.text();
  let body = null;
  try {
    body = text ? JSON.parse(text) : null;
  } catch {
    body = text;
  }
  if (!res.ok) {
    const msg =
      body?.errors?.[0]?.long_message ||
      body?.errors?.[0]?.message ||
      (typeof body === "string" ? body : JSON.stringify(body)) ||
      res.statusText;
    const err = new Error(msg);
    err.status = res.status;
    err.body = body;
    throw err;
  }
  return body;
}

function parseRole(meta) {
  if (meta && typeof meta === "object" && typeof meta.role === "string") {
    return meta.role;
  }
  return null;
}

async function findUserByEmail(email) {
  const q = encodeURIComponent(email);
  const result = await clerk(`/users?email_address[]=${q}&limit=5`);
  const list = Array.isArray(result) ? result : result?.data;
  return Array.isArray(list) && list.length > 0 ? list[0] : null;
}

async function main() {
  console.log(`Bootstrapping Super Admin for: ${EMAIL}`);

  const existing = await findUserByEmail(EMAIL);
  if (existing) {
    const prev = parseRole(existing.public_metadata);
    if (prev === "admin") {
      console.log(`OK — already Super Admin (id=${existing.id}).`);
      return;
    }
    await clerk(`/users/${existing.id}/metadata`, {
      method: "PATCH",
      body: JSON.stringify({ public_metadata: { role: "admin" } }),
    });
    console.log(
      `OK — updated ${EMAIL} (id=${existing.id}): publicMetadata.role ${prev ?? "(none)"} → admin`,
    );
    return;
  }

  try {
    const invitation = await clerk("/invitations", {
      method: "POST",
      body: JSON.stringify({
        email_address: EMAIL,
        public_metadata: { role: "admin" },
        notify: true,
        ignore_existing: false,
      }),
    });
    console.log(
      `OK — invitation sent to ${EMAIL} (invitation id=${invitation.id}) with role=admin.`,
    );
    console.log("User becomes Super Admin after accepting the Clerk invite.");
  } catch (err) {
    if (err.status === 422 || /already|exist|pending|taken/i.test(err.message || "")) {
      console.error(
        `Clerk conflict for ${EMAIL}: ${err.message}\n` +
          "Check Clerk Dashboard → Users / Invitations; set publicMetadata.role = \"admin\" manually if needed.",
      );
      process.exit(2);
    }
    throw err;
  }
}

main().catch((err) => {
  console.error("Bootstrap failed:", err?.message || err);
  process.exit(1);
});
