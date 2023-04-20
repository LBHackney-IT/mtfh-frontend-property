import * as Yup from "yup";

import { removeWhitespace } from "@mtfh/common/lib/utils";
import { regexUkPostcode } from "../../../utils/uk-postcode-regex";

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
