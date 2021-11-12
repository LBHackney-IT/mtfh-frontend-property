import React from "react";
import ReactDOM from "react-dom";

import singleSpaReact from "single-spa-react";

import Root from "./root.component";

import { ErrorSummary } from "@mtfh/common/lib/components";

import "./root.styles.scss";

const lifecycles = singleSpaReact({
  React,
  ReactDOM,
  rootComponent: Root,
  errorBoundary() {
    return (
      <ErrorSummary
        id="mtfh-property"
        title="Error"
        description="Unable to load property"
      />
    );
  },
});

export const { bootstrap, mount, unmount } = lifecycles;
