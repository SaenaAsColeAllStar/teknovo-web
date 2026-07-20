import { useAuth } from "@clerk/react";
import { useCallback, useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { toast } from "sonner";
import {
  cmsRoleCanManageSettings,
  parseCmsRole,
} from "@teknovo/shared";
import { useUser } from "@clerk/react";

import { Button } from "@/components/ui/button";
import {
  ApiClientError,
  createPlatformTenant,
  deletePlatformTenant,
  fetchPlatformStatus,
  fetchPlatformTenants,
  isApiConfigured,
  setupPlatformTenant,
  type PlatformStatus,
  type PlatformTenant,
} from "@/lib/api-client";

const platformUiEnabled =
  String(import.meta.env.VITE_PLATFORM_ENABLED || "").toLowerCase() ===
    "true" ||
  String(import.meta.env.VITE_PLATFORM_ENABLED || "") === "1";

/**
 * Minimal platform admin console (PRP Fase 10.8).
 * Hidden unless VITE_PLATFORM_ENABLED=true; API still requires PLATFORM_ENABLED.
 */
export function PlatformPage() {
  const { isLoaded, getToken } = useAuth();
  const { user } = useUser();
  const [status, setStatus] = useState<PlatformStatus | null>(null);
  const [tenants, setTenants] = useState<PlatformTenant[]>([]);
  const [loading, setLoading] = useState(true);
  const [slug, setSlug] = useState("");
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  const role = parseCmsRole(user?.publicMetadata);

  const reload = useCallback(async () => {
    if (!isApiConfigured()) return;
    const token = await getToken();
    if (!token) return;
    const st = await fetchPlatformStatus(token);
    setStatus(st);
    if (st.enabled) {
      setTenants(await fetchPlatformTenants(token));
    } else {
      setTenants([]);
    }
  }, [getToken]);

  useEffect(() => {
    if (!isLoaded || !platformUiEnabled) return;
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        await reload();
      } catch (err) {
        if (!cancelled) {
          toast.error(
            err instanceof ApiClientError
              ? err.message
              : "Gagal memuat platform status",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [isLoaded, reload]);

  if (!platformUiEnabled) {
    return <Navigate to="/" replace />;
  }

  if (!isLoaded) {
    return (
      <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
    );
  }

  if (!cmsRoleCanManageSettings(role)) {
    return <Navigate to="/" replace />;
  }

  async function onCreate(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const token = await getToken();
      if (!token) throw new Error("No token");
      await createPlatformTenant({ slug: slug.trim(), name: name.trim() }, token);
      toast.success("Tenant dibuat (provisioning via event bus)");
      setSlug("");
      setName("");
      await reload();
    } catch (err) {
      toast.error(
        err instanceof ApiClientError ? err.message : "Gagal membuat tenant",
      );
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <header>
        <h1 className="text-2xl font-semibold text-[color:var(--color-heading)]">
          Platform
        </h1>
        <p className="mt-1 text-sm text-[color:var(--color-body)]">
          Fondasi multi-tenant (Fase 10). Isolasi penuh & DNS per sekolah belum
          diaktifkan.
        </p>
      </header>

      {loading ? (
        <p className="text-sm text-[color:var(--color-body)]">Memuat…</p>
      ) : (
        <section className="border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4">
          <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">
            Status API
          </h2>
          <dl className="mt-2 grid gap-1 text-sm text-[color:var(--color-body)]">
            <div>
              Enabled:{" "}
              <span className="font-medium text-[color:var(--color-heading)]">
                {status?.enabled ? "true" : "false"}
              </span>
            </div>
            <div>
              Event bus:{" "}
              <span className="font-medium text-[color:var(--color-heading)]">
                {status?.eventBus ?? "—"}
              </span>
            </div>
            <div className="text-xs opacity-80">{status?.note}</div>
          </dl>
        </section>
      )}

      {!status?.enabled ? (
        <p className="text-sm text-[color:var(--color-body)]">
          Set <code>PLATFORM_ENABLED=true</code> pada Node API + migrasi Platform
          DB untuk mengaktifkan CRUD tenant.
        </p>
      ) : (
        <>
          <form
            onSubmit={onCreate}
            className="space-y-3 border border-[color:var(--color-border)] bg-[color:var(--color-surface)] p-4"
          >
            <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">
              Provision tenant
            </h2>
            <label className="block text-sm">
              Slug
              <input
                className="mt-1 w-full border border-[color:var(--color-border)] bg-transparent px-3 py-2"
                value={slug}
                onChange={(e) => setSlug(e.target.value)}
                pattern="[a-z0-9]+(?:-[a-z0-9]+)*"
                required
                placeholder="demo-school"
              />
            </label>
            <label className="block text-sm">
              Nama
              <input
                className="mt-1 w-full border border-[color:var(--color-border)] bg-transparent px-3 py-2"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                placeholder="SMA Demo"
              />
            </label>
            <Button type="submit" disabled={busy}>
              {busy ? "Menyimpan…" : "Buat tenant"}
            </Button>
          </form>

          <section className="space-y-2">
            <h2 className="text-sm font-semibold text-[color:var(--color-heading)]">
              Tenants ({tenants.length})
            </h2>
            {tenants.length === 0 ? (
              <p className="text-sm text-[color:var(--color-body)]">
                Belum ada tenant.
              </p>
            ) : (
              <ul className="divide-y divide-[color:var(--color-border)] border border-[color:var(--color-border)]">
                {tenants.map((t) => (
                  <li
                    key={t.id}
                    className="flex flex-wrap items-center justify-between gap-2 px-3 py-3 text-sm"
                  >
                    <div>
                      <div className="font-medium text-[color:var(--color-heading)]">
                        {t.name}{" "}
                        <span className="font-normal opacity-70">
                          ({t.slug})
                        </span>
                      </div>
                      <div className="text-xs text-[color:var(--color-body)]">
                        {t.status}
                        {t.minioBucket ? ` · ${t.minioBucket}` : ""}
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={async () => {
                          setBusy(true);
                          try {
                            const token = await getToken();
                            if (!token) return;
                            const res = await setupPlatformTenant(t.id, token);
                            toast.message(res.setup.detail);
                            await reload();
                          } catch (err) {
                            toast.error(
                              err instanceof ApiClientError
                                ? err.message
                                : "Setup gagal",
                            );
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        Setup
                      </Button>
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        disabled={busy}
                        onClick={async () => {
                          if (!confirm(`Hapus tenant ${t.slug}?`)) return;
                          setBusy(true);
                          try {
                            const token = await getToken();
                            if (!token) return;
                            await deletePlatformTenant(t.id, token);
                            toast.success("Tenant dihapus (async cleanup)");
                            await reload();
                          } catch (err) {
                            toast.error(
                              err instanceof ApiClientError
                                ? err.message
                                : "Hapus gagal",
                            );
                          } finally {
                            setBusy(false);
                          }
                        }}
                      >
                        Hapus
                      </Button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </section>
        </>
      )}
    </div>
  );
}
