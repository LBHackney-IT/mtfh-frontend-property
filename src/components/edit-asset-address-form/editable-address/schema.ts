import * as Yup from "yup";

import { removeWhitespace } from "@mtfh/common/lib/utils";

export const regexUkPostcode =
  /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const editableAddressSchema = () =>
  Yup.object({
    addressLine1: Yup.string().required("Address Line 1 is a required field"),
    addressLine2: Yup.string(),
    addressLine3: Yup.string(),
    addressLine4: Yup.string(),
    postcode: Yup.string()
      .trim()
      .transform(removeWhitespace)
      .required("Postcode is a required field")
      .matches(regexUkPostcode, "Please enter a valid postcode"),
  });

export type EditableAddressFormData = Yup.Asserts<
  ReturnType<typeof editableAddressSchema>
>;
