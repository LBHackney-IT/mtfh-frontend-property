import {
  getAssetV1,
  getCommentV2,
  getReferenceDataV1,
  getTenureV1,
  getWorkOrdersV2,
  mockCommentReferenceDataV1,
  server,
} from "@hackney/mtfh-test-utils";
import { rest } from "msw";

beforeEach(() => {
  server.use(getAssetV1());
  server.use(getTenureV1());
  server.use(
    rest.get("/api/v1/patch/all", (_req, res, ctx) => res(ctx.json([]))),
    rest.get("/api/v1/patch/:id", (req, res, ctx) =>
      res(ctx.json({ id: req.params.id, patchType: "patch", responsibleEntities: [] })),
    ),
    rest.get("/api/v1/cautionary-alerts/properties-new/:id", (_req, res, ctx) =>
      res(ctx.json({ alerts: [] })),
    ),
  );
  server.use(getCommentV2());
  server.use(getReferenceDataV1(mockCommentReferenceDataV1));
  server.use(getWorkOrdersV2());
});
