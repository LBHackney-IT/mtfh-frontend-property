import React from "react";

import { getAssetV1, mockAssetV1, render, server } from "@hackney/mtfh-test-utils";
import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { rest } from "msw";

import { NewAssetView } from ".";

import * as auth from "@mtfh/common/lib/auth/auth";

beforeEach(() => {
    jest.resetAllMocks();

    jest.spyOn(auth, "isAuthorisedForGroups").mockReturnValue(true);

    server.use(
        rest.post("/api/v1/assets", (req, res, ctx) => {
            return res(ctx.status(201));
        }),
    );
});

test("renders the whole 'New asset form' view", async () => {
    const { container } = render(<NewAssetView />);
  
    expect(container).toMatchSnapshot();
  });