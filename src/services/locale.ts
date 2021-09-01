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
    propertyType: (propertyType: string) => {
        if (propertyType === 'Dwelling') {
            return 'Dwelling';
        }
        if (propertyType === 'LettableNonDwelling') {
            return 'Lettable non-dwelling';
        }
        return propertyType;
    },
    tenureDetails: {
        tenureLabel: 'Tenure',
        expandedTenureSection: 'Tenure details',
        viewTenureButtonLabel: 'View tenure',
        propertyTypeLabel: 'Type',
        propertyPaymentReferenceLabel: 'Payment reference',
        uprnLabel: 'UPRN',
        propertyReferenceLabel: 'Reference',
        active: 'Active',
        isActive: (isActive: boolean) => (isActive ? 'Active' : 'Inactive'),
        status: 'Status',
        type: 'Type',
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
