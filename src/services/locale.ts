import { AssetAddress, AssetType } from '@mtfh/common/lib/api/asset/v1';

export default {
    backToSearch: 'Search results',
    cancel: 'Cancel',
    noDataForKey: 'N/A',
    assetDetails: {
        address: (assetAddress: AssetAddress): string => {
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
    assetType: (assetType: AssetType): string => {
        if (assetType === 'Dwelling') {
            return 'Dwelling';
        }
        if (assetType === 'LettableNonDwelling') {
            return 'Lettable non-dwelling';
        }
        return assetType;
    },
    tenureDetails: {
        tenureLabel: 'Tenure',
        expandedTenureSection: 'Tenure details',
        viewTenureButtonLabel: 'View tenure',
        assetTypeLabel: 'Type',
        assetPaymentReferenceLabel: 'Payment reference',
        uprnLabel: 'UPRN',
        assetReferenceLabel: 'Reference',
        active: 'Active',
        isActive: (isActive: boolean): string =>
            isActive ? 'Active' : 'Inactive',
        status: 'Status',
        type: 'Type',
        startDate: 'Start date',
        endDate: 'End date',
        noTenure: 'No tenure',
        paymentRef: 'Payment ref.',
    },
    assetCouldNotBeLoaded: 'This property could not be loaded.',
    errors: {
        unableToFetchRecord: 'There was a problem retrieving the record',
        assetDoesNotExist:
            "The property information you've requested does not exist",
        unableToFetchRecordDescription:
            'Please try again. If the issue persists, please contact support.',
        alertTitle: 'Error',
    },
};
