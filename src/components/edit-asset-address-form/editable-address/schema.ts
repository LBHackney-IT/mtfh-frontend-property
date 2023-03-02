import { removeWhitespace } from "@mtfh/common/lib/utils";
import { locale } from "services";
import * as Yup from "yup";

export const regexUkPostcode = /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const editableAddressSchema = () =>
  Yup.object({
    editableAddressLine1: Yup.string().required(),
    editableAddressLine2: Yup.string().required(),
    editableAddressLine3: Yup.string().required(),
    editableAddressLine4: Yup.string(),
    editablePostcode: Yup.string()
    .trim()
    .transform(removeWhitespace)
    .matches(regexUkPostcode, "Please enter a valid postcode").required(),
  });

export type EditableAddressFormData = Yup.Asserts<
  ReturnType<typeof editableAddressSchema>
>;