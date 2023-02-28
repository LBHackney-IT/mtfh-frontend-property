import * as Yup from "yup";

export const addressDetailsSchema = () =>
  Yup.object({
    addressLine1: Yup.string().required(),
    addressLine2: Yup.string().required(),
    addressLine3: Yup.string().required(),
    addressLine4: Yup.string(),
    postcode: Yup.string().required(),
  });

export type AddressDetailsFormData = Yup.Asserts<
  ReturnType<typeof addressDetailsSchema>
>;