import { requireCmsSession } from "@/lib/cms-auth";
import { getDb } from "@/lib/d1";
import { d1AnalyticsOverview } from "@/lib/d1/analytics-repo";
import { handleCmsApiError, okJson } from "@/lib/d1/http";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    await requireCmsSession();
    const db = await getDb();
    const data = await d1AnalyticsOverview(db);
    return okJson(data);
  } catch (err) {
    return handleCmsApiError(err);
  }
}
