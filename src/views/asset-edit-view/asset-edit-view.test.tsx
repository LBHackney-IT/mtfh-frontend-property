import React from "react";

import {
    getAddressV1,
    getAssetV1, mockAddresses, mockAssetV1, render,
    server
} from "@hackney/mtfh-test-utils";
import { logRoles, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import { AssetEditView } from ".";

beforeEach(() => {
    jest.resetAllMocks();
    server.use(
        rest.get(
            `/api/v1/assets/${mockAssetV1.id}`,
            (req, res, ctx) => res(ctx.status(200), ctx.json(mockAssetV1),
            ),
        )
    );

    server.use(getAddressV1())

        });


test("renders the error on asset load failure", async () => {
    server.use(getAssetV1(undefined, 500));
    render(<AssetEditView />, {
        url: `/property/edit/${mockAssetV1.id}`,
        path: "/property/edit/:assetId",
    });

    await screen.findByRole("alert");
});

test("renders the property edit view", async () => {
    const { container } = render(<AssetEditView />, {
        url: `/property/edit/${mockAssetV1.id}`,
        path: "/property/edit/:assetId",
    });
    
    // const llpgAddressHeading = await screen.findAllByRole("heading", { name: "Suggestion from the Local Gazetteer" })

    // expect(llpgAddressHeading).toHaveTextContent("Suggestion from the Local Gazetteer")

    // await waitFor(() =>{
    //     const addressLine1Field = screen.findByAltText("Address line 1*")
    //     console.log("addressLine1Field", addressLine1Field)
    // })

    // const mainHeading = screen.getAllByRole("heading")[0]

    await waitFor(() =>
        // expect(mainHeading).toHaveTextContent(
        //     "Edit property address"),
        expect(screen.getAllByRole("heading")).toHaveLength(3),
    );

    logRoles(container)

    

    // await waitFor(async () =>
    //     expect(await screen.findAllByRole("heading", { name: "Suggestion from the Local Gazetteer" })).toHaveTextContent(
    //         "Suggestion from the Local Gazetteer")
    // );


    // screen.debug()


    // expect(container).toMatchSnapshot();


    // screen.getByText(mockAssetV1.assetId);
    // screen.getByText(/Reference/);
});