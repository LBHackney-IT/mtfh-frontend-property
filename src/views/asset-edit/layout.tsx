import React, { FC } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Asset } from "@mtfh/common/lib/api/asset/v1";
import {
    Alert as AlertIcon,
    Button,
    Center,
    CommentList,
    Heading,
    Layout,
    Link,
    PageAnnouncement,
    PageAnnouncementProvider,
    SideBar,
    SideBarProps,
    Spinner,
    WorkOrderList,
} from "@mtfh/common/lib/components";


export interface AssetEditLayoutProperties {
    assetDetails: Asset;
}

export const AssetEditLayout: FC<AssetEditLayoutProperties> = ({ assetDetails }) => {


    return (
        <>
            <h3>Asset Edit View</h3>
            <p>{JSON.stringify(assetDetails)}</p>
        </>
        //   <PageAnnouncementProvider sessionKey="asset">
        //     <PageAnnouncement />
        //     <Layout
        //       backLink={
        //         <Link as={RouterLink} to="/search" variant="back-link">
        //           {locale.backToSearch}
        //         </Link>
        //       }
        //       top={
        //         <Heading variant="h1">
        //           {alertsData.alerts?.length > 0 && (
        //             <AlertIcon
        //               viewBox="0 0 37 58"
        //               width="28"
        //               height="44"
        //               style={{ margin: "-2px 4px 0 0" }}
        //             />
        //           )}
        //           {locale.assetDetails.address(assetDetails.assetAddress)}
        //         </Heading>
        //       }
        //       side={<AssetSideBar assetDetails={assetDetails} alerts={alertsData.alerts} />}
        //     >
        //       <PropertyBody assetId={assetDetails.assetId} propertyId={assetDetails.id} />
        //     </Layout>
        //   </PageAnnouncementProvider>
    );
};