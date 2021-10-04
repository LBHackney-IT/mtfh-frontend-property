import { getAssetV1, server } from '@hackney/mtfh-test-utils';

beforeEach(() => {
    server.use(getAssetV1());
});
