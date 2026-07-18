import { NextResponse } from "next/server";

import {
  cmsAuthErrorResponse,
  CmsAuthError,
  requireCmsSession,
  requireCmsWriter,
} from "@/lib/cms-auth";
import {
  CMS_MEDIA_ALLOWED_TYPES,
  CMS_MEDIA_MAX_BYTES,
  deleteCmsUpload,
  listCmsUploads,
  mediaErrorMessage,
  putCmsUpload,
} from "@/lib/cms-media";

export const dynamic = "force-dynamic";

/** List CMS uploads under `cms/uploads/`. */
export async function GET(request: Request) {
  try {
    await requireCmsSession();
    const { searchParams } = new URL(request.url);
    const cursor = searchParams.get("cursor") ?? undefined;
    const limitRaw = Number(searchParams.get("limit") ?? "100");
    const limit = Number.isFinite(limitRaw) ? limitRaw : 100;

    const result = await listCmsUploads({ cursor, limit });
    return NextResponse.json({
      ok: true,
      data: result.objects,
      meta: {
        truncated: result.truncated,
        cursor: result.cursor ?? null,
        total: result.objects.length,
      },
    });
  } catch (err) {
    if (err instanceof CmsAuthError) return cmsAuthErrorResponse(err);
    return NextResponse.json(
      {
        ok: false,
        error: { code: "R2_UNAVAILABLE", message: mediaErrorMessage(err) },
      },
      { status: 503 },
    );
  }
}

/** Upload a file to R2 via Workers binding (multipart form field `file`). */
export async function POST(request: Request) {
  try {
    await requireCmsWriter();

    let form: FormData;
    try {
      form = await request.formData();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "BAD_REQUEST",
            message: "Body harus multipart/form-data dengan field file.",
          },
        },
        { status: 400 },
      );
    }

    const entry = form.get("file");
    if (!(entry instanceof File) || entry.size === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "BAD_REQUEST", message: "File upload kosong." },
        },
        { status: 400 },
      );
    }

    if (entry.size > CMS_MEDIA_MAX_BYTES) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "PAYLOAD_TOO_LARGE",
            message: `Ukuran maksimal ${Math.floor(CMS_MEDIA_MAX_BYTES / (1024 * 1024))} MiB.`,
          },
        },
        { status: 413 },
      );
    }

    const contentType = entry.type || "application/octet-stream";
    if (!CMS_MEDIA_ALLOWED_TYPES.has(contentType)) {
      return NextResponse.json(
        {
          ok: false,
          error: {
            code: "UNSUPPORTED_MEDIA_TYPE",
            message:
              "Tipe file tidak didukung. Gunakan JPEG, PNG, WebP, GIF, SVG, atau PDF.",
          },
        },
        { status: 415 },
      );
    }

    const saved = await putCmsUpload(entry, entry.name, contentType);
    return NextResponse.json({ ok: true, data: saved }, { status: 201 });
  } catch (err) {
    if (err instanceof CmsAuthError) return cmsAuthErrorResponse(err);
    return NextResponse.json(
      {
        ok: false,
        error: { code: "R2_UNAVAILABLE", message: mediaErrorMessage(err) },
      },
      { status: 503 },
    );
  }
}

/** Delete an upload by key (JSON `{ key }`). Only `cms/uploads/*`. */
export async function DELETE(request: Request) {
  try {
    await requireCmsWriter();

    let body: unknown;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "BAD_REQUEST", message: "Body JSON tidak valid." },
        },
        { status: 400 },
      );
    }

    const key =
      body &&
      typeof body === "object" &&
      "key" in body &&
      typeof (body as { key: unknown }).key === "string"
        ? (body as { key: string }).key.trim()
        : "";

    if (!key) {
      return NextResponse.json(
        {
          ok: false,
          error: { code: "BAD_REQUEST", message: "Field key wajib diisi." },
        },
        { status: 400 },
      );
    }

    await deleteCmsUpload(key);
    return NextResponse.json({ ok: true, data: { key } });
  } catch (err) {
    if (err instanceof CmsAuthError) return cmsAuthErrorResponse(err);
    const message = mediaErrorMessage(err);
    const status = message.includes("cms/uploads") ? 400 : 503;
    return NextResponse.json(
      {
        ok: false,
        error: {
          code: status === 400 ? "BAD_REQUEST" : "R2_UNAVAILABLE",
          message,
        },
      },
      { status },
    );
  }
}
