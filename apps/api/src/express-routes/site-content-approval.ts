import { Router } from "express";
import {
  siteContentRejectSchema,
  siteContentReorderSchema,
} from "@teknovo/shared";
import {
  requireCmsModerator,
  requireCmsSession,
  requireCmsSiteContentWriter,
} from "../auth/cms-auth";
import {
  approveSiteContent,
  listPendingSiteContent,
  rejectSiteContent,
  reorderSiteContent,
  submitSiteContent,
} from "../lib/data/site-content-approval";
import {
  displayTitle,
  SITE_CONTENT_ENTITY_PATHS,
  type SiteContentEntityPath,
} from "../lib/prisma/site-content-approval";
import { triggerWebRebuild } from "../lib/rebuild-web";
import {
  asyncHandler,
  exBackground,
  exErr,
  exHandleError,
  exOk,
  getBindings,
  p,
  toWebRequest,
} from "../lib/express-http";

/** Aggregate queue — GET /api/v1/site-content/pending-review */
export const siteContentApprovalExpressRouter = Router();

siteContentApprovalExpressRouter.get(
  "/pending-review",
  asyncHandler(async (req, res) => {
    try {
      const env = getBindings(res);
      const session = await requireCmsSession(toWebRequest(req), env);
      if (!session.canViewModerasi) {
        exErr(res, "FORBIDDEN", "Tidak dapat melihat antrian moderasi.", 403);
        return;
      }
      const items = await listPendingSiteContent(env);
      exOk(res, { items, entities: SITE_CONTENT_ENTITY_PATHS });
    } catch (err) {
      exHandleError(res, err);
    }
  }),
);

/** Per-entity submit / approve / reject / reorder — mount under `/api/v1/:entity`. */
export function createSiteContentEntityApprovalRouter(
  entity: SiteContentEntityPath,
): Router {
  const router = Router({ mergeParams: true });

  router.post(
    "/reorder",
    asyncHandler(async (req, res) => {
      try {
        const env = getBindings(res);
        await requireCmsSiteContentWriter(toWebRequest(req), env);
        const parsed = siteContentReorderSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
          exErr(
            res,
            "VALIDATION",
            parsed.error.issues[0]?.message ?? "Payload reorder tidak valid.",
            400,
          );
          return;
        }
        const result = await reorderSiteContent(env, entity, parsed.data.items);
        exOk(res, result);
      } catch (err) {
        exHandleError(res, err);
      }
    }),
  );

  router.post(
    "/:id/submit",
    asyncHandler(async (req, res) => {
      try {
        const env = getBindings(res);
        await requireCmsSiteContentWriter(toWebRequest(req), env);
        const updated = await submitSiteContent(env, entity, p(req, "id"));
        if (!updated) {
          exErr(
            res,
            "CONFLICT",
            "Konten tidak dapat diajukan (harus DRAFT, REJECTED, atau ARCHIVED).",
            409,
          );
          return;
        }
        exOk(res, {
          id: updated.id,
          status: updated.status,
          title: displayTitle(updated),
        });
      } catch (err) {
        exHandleError(res, err);
      }
    }),
  );

  router.post(
    "/:id/approve",
    asyncHandler(async (req, res) => {
      try {
        const env = getBindings(res);
        const session = await requireCmsModerator(toWebRequest(req), env);
        const updated = await approveSiteContent(
          env,
          entity,
          p(req, "id"),
          session.userId,
        );
        if (!updated) {
          exErr(
            res,
            "CONFLICT",
            "Konten tidak dalam status PENDING_REVIEW.",
            409,
          );
          return;
        }
        const slug = updated.slug ?? updated.id;
        exBackground(triggerWebRebuild(env, `${entity}:approve:${slug}`));
        exOk(res, {
          id: updated.id,
          status: updated.status,
          title: displayTitle(updated),
          reviewedBy: updated.reviewedBy,
          reviewedAt: updated.reviewedAt?.toISOString() ?? null,
          publishedAt: updated.publishedAt?.toISOString() ?? null,
        });
      } catch (err) {
        exHandleError(res, err);
      }
    }),
  );

  router.post(
    "/:id/reject",
    asyncHandler(async (req, res) => {
      try {
        const env = getBindings(res);
        const session = await requireCmsModerator(toWebRequest(req), env);
        const parsed = siteContentRejectSchema.safeParse(req.body ?? {});
        if (!parsed.success) {
          exErr(
            res,
            "VALIDATION",
            parsed.error.issues[0]?.message ?? "Catatan penolakan wajib.",
            400,
          );
          return;
        }
        const updated = await rejectSiteContent(
          env,
          entity,
          p(req, "id"),
          session.userId,
          parsed.data.note,
        );
        if (!updated) {
          exErr(
            res,
            "CONFLICT",
            "Konten tidak dalam status PENDING_REVIEW.",
            409,
          );
          return;
        }
        exOk(res, {
          id: updated.id,
          status: updated.status,
          title: displayTitle(updated),
          reviewedBy: updated.reviewedBy,
          reviewedAt: updated.reviewedAt?.toISOString() ?? null,
          reviewNote: updated.reviewNote,
        });
      } catch (err) {
        exHandleError(res, err);
      }
    }),
  );

  return router;
}
