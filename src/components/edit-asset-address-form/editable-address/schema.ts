import { removeWhitespace } from "@mtfh/common/lib/utils";
import { locale } from "services";
import * as Yup from "yup";

export const regexUkPostcode = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const editableAddressSchema = () =>
// The below are capitalized as they may be used in error messages (ex: "AddressLine1 is a required field")
  Yup.object({
    AddressLine1: Yup.string().required(),
    AddressLine2: Yup.string(),
    AddressLine3: Yup.string(),
    AddressLine4: Yup.string(),
    Postcode: Yup.string()
    .trim()
    .transform(removeWhitespace)
    .matches(regexUkPostcode, "Please enter a valid postcode")
    .required(),
  });

export type EditableAddressFormData = Yup.Asserts<
  ReturnType<typeof editableAddressSchema>
>;