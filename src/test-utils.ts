import {
  getAssetV1,
  getCommentV2,
  getReferenceDataV1,
  getWorkOrdersV2,
  mockCommentReferenceDataV1,
  server,
} from "@hackney/mtfh-test-utils";

beforeEach(() => {
  server.use(getAssetV1());
  server.use(getCommentV2());
  server.use(getReferenceDataV1(mockCommentReferenceDataV1));
  server.use(getWorkOrdersV2());
});
