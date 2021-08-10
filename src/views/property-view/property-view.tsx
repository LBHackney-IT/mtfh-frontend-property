import { useParams } from 'react-router-dom';
import React from 'react';
import { Center, ErrorSummary, Spinner } from '@mtfh/common';
import { PropertyLayout } from './layout';
import { locale, useProperty} from '../../services';
export const PropertyView = (): JSX.Element => {
    const { propertyId } = useParams<{ propertyId: string }>();

    const { data: property, ...propertyRequest } = useProperty(propertyId);
    if (propertyRequest.error) {
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
