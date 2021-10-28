import {
    getAssetV1,
    server,
    getCommentV2,
    getReferenceDataV1,
    mockReferenceDataV1,
} from '@hackney/mtfh-test-utils';

beforeEach(() => {
    server.use(getAssetV1());
    server.use(getCommentV2());
    server.use(getReferenceDataV1({ category: [mockReferenceDataV1] }));
});
