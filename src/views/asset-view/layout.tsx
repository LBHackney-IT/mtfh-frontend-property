import { Link as RouterLink } from 'react-router-dom';
import React, { FC } from 'react';

import { isFutureDate } from '@mtfh/common/lib/utils';
import { hasToggle } from '@mtfh/common/lib/configuration';
import {
    Button,
    Layout,
    Link,
    PageAnnouncementProvider,
    PageAnnouncement,
    SideBar,
    SideBarSection,
    SideBarProps,
} from '@mtfh/common/lib/components';
import { Asset } from '@mtfh/common/lib/api/asset/v1';
import { locale } from '../../services';
import { AssetDetails, TenureDetails } from '../../components';
import './styles.scss';

export interface AssetLayoutProperties {
    assetDetails: Asset;
}

interface AssetSideBarProperties
    extends Partial<SideBarProps>,
        AssetLayoutProperties {}

const AssetSideBar = ({
    assetDetails,
    ...properties
}: AssetSideBarProperties) => {
    const { assetAddress, assetId, assetType, tenure, id } = assetDetails;

    return (
        <div className="mtfh-asset-sidebar">
            <SideBar id="property-view-sidebar" {...properties}>
                <AssetDetails
                    assetAddress={assetAddress}
                    assetType={assetType}
                    assetReference={assetId}
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
                        {locale.assetDetails.newTenure}
                    </Button>
                )}
        </div>
    );
};

export const AssetLayout: FC<AssetLayoutProperties> = ({ assetDetails }) => {
    return (
        <PageAnnouncementProvider sessionKey="asset">
            <PageAnnouncement />
            <Layout
                top={
                    <>
                        <Link as={RouterLink} to="/search" variant="back-link">
                            {locale.backToSearch}
                        </Link>
                        <h1 className="heading">
                            {locale.assetDetails.address(
                                assetDetails.assetAddress
                            )}
                        </h1>
                    </>
                }
                side={<AssetSideBar assetDetails={assetDetails} />}
            />
        </PageAnnouncementProvider>
    );
};