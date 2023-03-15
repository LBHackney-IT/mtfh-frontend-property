import React from "react";
import { Link as RouterLink } from "react-router-dom";

import { locale } from "../../services";

import { ErrorSummary, Link, StatusBox } from "@mtfh/common/lib/components";

import { useUserFeedback } from "../../services/hooks/useUserFeedback";
import { NewAsset } from "../../components/new-asset-form";
// import "./styles.scss";

export const NewPropertyLayout = (): JSX.Element => {

    const {
        showSuccess, setShowSuccess,
        showError, setShowError,
        errorHeading, setErrorHeading,
        errorDescription, setErrorDescription
    } = useUserFeedback()

    return (
        <>
            <Link as={RouterLink} to={`#`} variant="back-link">
                Back
            </Link>
            <h1 className="lbh-heading-h1">New property</h1>


            {showSuccess && (
                <StatusBox
                    variant="success"
                    title={locale.assets.newPropertyAddedSuccessMessage}
                />
            )}

            {showError && (
                <ErrorSummary
                    id="patch-asset-error"
                    title={errorHeading || ""}
                    description={errorDescription || undefined}
                />
            )}

            <section>
                <NewAsset />
            </section>
        </>
    );
};
