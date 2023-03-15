import { useState } from "react";

export const useUserFeedback = () => {
    const [showSuccess, setShowSuccess] = useState<boolean>(false);
    const [showError, setShowError] = useState<boolean>(false);
    const [errorHeading, setErrorHeading] = useState<string | null>(null);
    const [errorDescription, setErrorDescription] = useState<string | null>(null);

    return {
        showSuccess,
        setShowSuccess,
        showError,
        setShowError,
        errorHeading,
        setErrorHeading,
        errorDescription,
        setErrorDescription
    }
}