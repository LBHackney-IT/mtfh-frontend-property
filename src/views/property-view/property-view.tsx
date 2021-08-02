import { useParams } from 'react-router-dom';
import React from 'react';
import { Center, ErrorSummary, Spinner } from '@mtfh/common';
import { PropertyLayout } from './layout';
import { locale, usePropertyMock } from '../../services';
export const PropertyView = (): JSX.Element => {
    const { propertyId } = useParams<{ propertyId: string }>();

    const { data: property, error } = usePropertyMock(propertyId);

    if (error) {
        return (
            <ErrorSummary
                id="property-error"
                title={locale.errors.unableToFetchRecord}
                description={locale.errors.unableToFetchRecordDescription}
            />
        );
    }

    if (!property) {
        return (
            <Center>
                <Spinner />
            </Center>
        );
    }

    return <PropertyLayout propertyDetails={property} />;
};
