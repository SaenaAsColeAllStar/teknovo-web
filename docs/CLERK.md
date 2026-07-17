# Clerk setup — teknovo-web CMS

## 1. Buat aplikasi Clerk

1. Buka [dashboard.clerk.com](https://dashboard.clerk.com)
2. Create application → aktifkan Email (dan Google opsional)
3. Salin **Publishable key** dan **Secret key**

## 2. Environment

Salin `.env.example` → `.env.local`:

```bash
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...   # setelah webhook dibuat

NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard
```

Jangan commit `.env.local`. Placeholder `GANTI_*` di `.env.example` sengaja aman.

## 3. Paths & proxy

- `ClerkProvider` di `src/app/layout.tsx`
- `clerkMiddleware` + `auth.protect()` untuk `/dashboard(.*)` di `src/proxy.ts`
- UI: `/sign-in`, `/sign-up` (Clerk `<SignIn />` / `<SignUp />`)
- Sidebar CMS: `<UserButton />`

## 4. Webhook (opsional, sync user)

1. Clerk Dashboard → Webhooks → endpoint:
   `https://<domain>/api/webhook/clerk`
2. Events: `user.created`, `user.updated`, `user.deleted`
3. Salin signing secret → `CLERK_WEBHOOK_SECRET`
4. Route stub: `src/app/api/webhook/clerk/route.ts` — verifikasi Svix masih TODO

## 5. Roles

Simpan role di `user.publicMetadata.role`: `admin` | `editor` | `viewer`.
Helper: `parseCmsRole()` di `src/lib/clerk.ts`.

## 6. Cloudflare / production

Set secrets di Cloudflare Workers/Pages (Wrangler / dashboard):

- `CLERK_SECRET_KEY`
- `CLERK_WEBHOOK_SECRET`
- `REVALIDATE_SECRET`
- `NEXT_PUBLIC_*` sebagai plain vars (bukan secret)

Pastikan domain production ditambahkan di Clerk → Domains.
