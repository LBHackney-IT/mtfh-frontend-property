import {
  getAssetV1,
  getCommentV2,
  getReferenceDataV1,
  mockReferenceDataV1,
  server,
} from "@hackney/mtfh-test-utils";

beforeEach(() => {
  server.use(getAssetV1());
  server.use(getCommentV2());
  server.use(getReferenceDataV1({ category: [mockReferenceDataV1] }));
});
