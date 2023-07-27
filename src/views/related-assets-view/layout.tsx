import React, { useState } from "react";
import { Link as RouterLink } from "react-router-dom";
import { Link } from "@mtfh/common/lib/components";

export const RelatedAssetsLayout = (): JSX.Element => {
    const [showError, setShowError] = useState<boolean>(false);
    const [errorHeading, setErrorHeading] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    return (
        <>
            <Link as={RouterLink} to="#" variant="back-link">
                Back
            </Link>
            <h1 className="lbh-heading-h1">Related assets</h1>
        </>
    );
};
