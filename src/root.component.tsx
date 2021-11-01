import React from "react";

import App from "./app";

import { ConfirmationRouter } from "@mtfh/common/lib/components";

import "./root.styles.scss";

export default function Root(): JSX.Element {
  return (
    <ConfirmationRouter>
      <App />
    </ConfirmationRouter>
  );
}
