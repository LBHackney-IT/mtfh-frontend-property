import { Property } from '../services/property';

const activeTenure = {
    id: '0bb55bde-bc73-d7fe-0324-5cee5b59bc8c',
    paymentReference: '228008546',
    type: 'SECURE',
    startOfTenureDate: '2004-09-16',
    endOfTenureDate: '2021-08-03',
    isActive: true,
};


const inActiveTenure = {
    id: '0bb55bde-bc73-d7fe-0324-5cee5b59bc8c',
    paymentReference: '228008546',
    type: 'SECURE',
    startOfTenureDate: '2004-09-16',
    endOfTenureDate: '2021-08-03',
    isActive: false,
};


export const mockProperty: Property = {
    id: 'string',
    assetId: 'string',
    assetType: 'Dwelling',
    assetLocation: {
        floorNo: 0,
        totalBlockFloors: 4,
        parentAssets: [
            {
                type: 'block',
                id: '6f22e9ae-3e8a-4e0e-af46-db02eb87f8e6',
                name: 'Stone Bridge Estate',
            },
        ],
    },
    assetAddress: {
        uprn: '100021065786',
        addressLine1: 'Powell Road',
        addressLine2: 'Hackney',
        addressLine3: 'London',
        addressLine4: '',
        postCode: 'E5 8DH',
        postPreamble: '1 Newcome House',
    },
    assetManagement: {
        agent: 'HAH',
        areaOfficeName: 'Clapton Panel Area Team',
        isCouncilProperty: true,
        managingOrganisation: 'LBH',
        managingOrganisationId: '6f22e9ae-3e8a-4e0e-af46-db02eb87f8e6',
        owner: 'London Borough of Hackney',
        isTMOManaged: true,
    },
    assetCharacteristics: {
        numberOfBedrooms: 2,
        numberOfLifts: 3,
        numberOfLivingRooms: 1,
        windowType: 'DBL',
        yearConstructed: '1978',
    },
    tenure: activeTenure,
    rootAsset: '6f22e9ae-3e8a-4e0e-af46-db02eb87f8e6',
    parentAssetIds:
        '6f22e9ae-3e8a-4e0e-af46-db02eb87f8e6#6f22e9ae-3e8a-4e0e-af46-db02eb87f8e6#6f22e9ae-3e8a-4e0e-af46-db02eb87f8e6',
};


export const mockPropertyWithInactiveTenure: Property = {
    ...mockProperty,
    tenure: inActiveTenure,
};
