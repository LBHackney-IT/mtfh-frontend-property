import { AssetAddress } from '../services';

export default {
    backToSearch: 'Search results',
    cancel: 'Cancel',
    noDataForKey: 'N/A',
    propertyDetails: {
        heading: (assetAddress: AssetAddress) => {
            const {
                addressLine1,
                addressLine2,
                addressLine3,
                addressLine4,
                postCode,
            } = assetAddress;
            return `${addressLine1} ${addressLine2} ${addressLine3} ${addressLine4} ${postCode}`;
        },
        expandedTenureSection: 'Tenure details',
        buttonLabel: 'View tenure',
        propertyTypeLabel: 'Property type',
        uprnLabel: 'UPRN',
        propertyReferenceLabel: 'Property reference',
        active: 'Active',
        inActive: 'Inactive',
        status: 'Status',
        type: 'Tenure type',
        startDate: 'Start date',
        endDate: 'End date',
    },
    errors: {
        unableToFetchRecord: 'There was a problem retrieving the record',
        propertyDoesNotExist:
            "The property information you've requested does not exist",
        unableToFetchRecordDescription:
            'Please try again. If the issue persists, please contact support.',
        alertTitle: 'Error',
    },
};
