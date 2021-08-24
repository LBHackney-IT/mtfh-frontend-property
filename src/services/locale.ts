import { AssetAddress } from '../services';

export default {
    backToSearch: 'Search results',
    cancel: 'Cancel',
    noDataForKey: 'N/A',
    propertyDetails: {
        address: (assetAddress: AssetAddress) => {
            const {
                postPreamble,
                addressLine1,
                addressLine2,
                addressLine3,
                addressLine4,
                postCode,
            } = assetAddress;

            return [
                postPreamble,
                addressLine1,
                addressLine2,
                addressLine3,
                addressLine4,
                postCode,
            ]
                .filter(addressLine => !!addressLine)
                .join(' ');
        },
        newTenure: 'New tenure',
    },
    tenureDetails: {
        tenureLabel: 'Tenure',
        expandedTenureSection: 'Tenure details',
        viewTenureButtonLabel: 'View tenure',
        propertyTypeLabel: 'Property type',
        propertyPaymentReferenceLabel: 'Payment reference',
        uprnLabel: 'UPRN',
        propertyReferenceLabel: 'Property reference',
        active: 'Active',
        isActive: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
        status: 'Status',
        type: 'Tenure type',
        startDate: 'Start date',
        endDate: 'End date',
        noTenure: 'No tenure',
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
