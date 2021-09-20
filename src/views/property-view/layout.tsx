import { Link as RouterLink } from 'react-router-dom';
import React, { FC } from 'react';

import {
    hasToggle,
    Button,
    Layout,
    Link,
    PageAnnouncementProvider,
    PageAnnouncement,
    SideBar,
    SideBarSection,
    SideBarProps,
} from '@mtfh/common';
import { isFutureDate } from '../../utils';
import { locale, Property } from '../../services';
import { PropertyDetails, TenureDetails } from '../../components';
import './styles.scss';

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
    const { assetAddress, assetId, assetType, tenure, id } = propertyDetails;

    return (
        <div className="mtfh-property-sidebar">
            <SideBar id="property-view-sidebar" {...properties}>
                <PropertyDetails
                    assetAddress={assetAddress}
                    assetType={assetType}
                    propertyReference={assetId}
                />
                <SideBarSection
                    id="tenure-details"
                    title={locale.tenureDetails.expandedTenureSection}
                >
                    <TenureDetails tenure={tenure} />
                </SideBarSection>
            </SideBar>
            {hasToggle('MMH.CreateTenure') &&
                (!tenure ||
                    !tenure.isActive ||
                    !isFutureDate(tenure.endOfTenureDate)) && (
                    <Button as={RouterLink} to={`/tenure/${id}/add`}>
                        {locale.propertyDetails.newTenure}
                    </Button>
                )}
        </div>
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
                            {locale.propertyDetails.address(
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
