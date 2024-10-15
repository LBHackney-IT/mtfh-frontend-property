import React, { ComponentPropsWithoutRef, FC } from "react";

import cn from "classnames";

import "./styles.scss";

export const SearchCard: FC<ComponentPropsWithoutRef<"div">> = ({
  className,
  ...props
}) => <div className={cn("mtfh-search-card", className)} {...props} />;
