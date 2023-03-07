import React from "react";

import {
    getAddressV1,
    getAssetV1, mockAddresses, mockAssetV1, render,
    server
} from "@hackney/mtfh-test-utils";
import { logRoles, screen, waitFor } from "@testing-library/react";
import { rest } from "msw";

import { AssetEditView } from ".";

const assetData = {
    "id": "15adc44b-6fde-46e8-af9c-e18b1495c9ab",
    "assetId": "100021045676",
    "assetType": "LettableNonDwelling",
    "rootAsset": null,
    "parentAssetIds": null,
    "isActive": false,
    "assetLocation": null,
    "assetAddress": {
        "uprn": "100021045676",
        "addressLine1": "FLAT B",
        "addressLine2": "51 GREENWOOD ROAD",
        "addressLine3": "HACKNEY",
        "addressLine4": "LONDON",
        "postCode": "E8 1NT",
        "postPreamble": null
    },
    "assetManagement": {
        "agent": null,
        "areaOfficeName": null,
        "isCouncilProperty": false,
        "managingOrganisation": null,
        "managingOrganisationId": "00000000-0000-0000-0000-000000000000",
        "owner": null,
        "isTMOManaged": false,
        "propertyOccupiedStatus": null,
        "propertyOccupiedStatusReason": null,
        "isNoRepairsMaintenance": false,
        "councilTaxType": null,
        "councilTaxLiability": null,
        "isTemporaryAccomodation": true,
        "readyToLetDate": false
    },
    "assetCharacteristics": null,
    "tenure": null,
    "versionNumber": 18,
    "patches": [
        {
            "id": "bd0a8e2b-c3b5-4628-aa33-8e7509d5eac6",
            "parentId": "8d4fb05d-3ff5-48b7-a17a-71fcb27a66a8",
            "name": "SN4",
            "patchType": "patch",
            "domain": "MMH",
            "responsibleEntities": [],
            "versionNumber": null
        }
    ]
}

const llpgAddressData = {
    "data": {
        "address": [
            {
                "line1": "FLAT B",
                "line2": "51 GREENWOOD ROAD",
                "line3": "HACKNEY",
                "line4": "",
                "town": "LONDON",
                "postcode": "E8 1NT",
                "UPRN": 100021045676
            }
        ],
        "page_count": 1,
        "total_count": 1
    },
    "statusCode": 200
}

beforeEach(() => {
    jest.resetAllMocks();

    server.use(
        rest.get("/api/v1/assets/:id", (req, res, ctx) => {
            return res(
                ctx.json(assetData),
            );
        }))

    server.use(
        rest.get("/api/v1/addresses", (req, res, ctx) => {
            return res(
                ctx.json(llpgAddressData),
            );
        }))

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
        url: `/property/edit/${assetData.id}`,
        path: "/property/edit/:assetId",
    });

    await waitFor(() =>
        expect(screen.getAllByRole("heading")).toHaveLength(3),
    );
    screen.debug()
});