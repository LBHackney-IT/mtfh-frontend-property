import { Link as RouterLink } from 'react-router-dom';
import React, { FC } from 'react';

import {
    Layout,
    Link,
    PageAnnouncementProvider,
    PageAnnouncement,
    SideBar,
    SideBarSection,
    SideBarProps,
} from '@mtfh/common';
import { locale, Property } from '../../services';
import './styles.scss';

import { PropertyDetails, TenureDetails } from '../../components';

export interface PropertyLayoutProperties {
    propertyDetails: Property;
}

interface PropertySideBarProperties
    extends Partial<SideBarProps>,
        PropertyLayoutProperties {}

const PropertySideBar = ({
    propertyDetails,
    ...properties
}: PropertySideBarProperties) => {
    const { assetAddress, assetType, tenure } = propertyDetails;
    const { paymentReference } = tenure;

    return (
        <SideBar id="property-view-sidebar" {...properties}>
            <PropertyDetails
                assetAddress={assetAddress}
                assetType={assetType}
                propertyReference={paymentReference}
            />
            <SideBarSection
                id="tenure-details"
                title={locale.tenureDetails.expandedTenureSection}
            >
                <TenureDetails tenure={tenure} />
            </SideBarSection>
        </SideBar>
    );
};

export const PropertyLayout: FC<PropertyLayoutProperties> = ({
    propertyDetails,
}) => {
    return (
        <PageAnnouncementProvider sessionKey="property">
            <PageAnnouncement />
            <Layout
                top={
                    <>
                        <Link as={RouterLink} to="/search" variant="back-link">
                            {locale.backToSearch}
                        </Link>
                        <h1 className="heading">
                            {locale.propertyDetails.heading(
                                propertyDetails.assetAddress
                            )}
                        </h1>
                    </>
                }
                side={<PropertySideBar propertyDetails={propertyDetails} />}
            />
        </PageAnnouncementProvider>
    );
};
