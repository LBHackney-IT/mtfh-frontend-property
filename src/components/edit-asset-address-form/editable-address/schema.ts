import * as Yup from "yup";

import { regexUkPostcode } from "../../../utils/uk-postcode-regex";

import { removeWhitespace } from "@mtfh/common/lib/utils";

export const editableAddressSchema = () =>
  Yup.object({
    postPreamble: Yup.string(),
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
