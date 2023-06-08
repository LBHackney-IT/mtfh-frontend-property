import * as Yup from "yup";

import { regexUkPostcode } from "../../utils/uk-postcode-regex";

import { removeWhitespace } from "@mtfh/common/lib/utils";

export const newPropertySchema = () =>
  Yup.object({
    assetId: Yup.string().required("Asset ID is a required field"),
    assetType: Yup.string().required("Asset Type is a required field"),
    propertyEstate: Yup.string(),
    propertyBlock: Yup.string(),
    // propertySubBlock: Yup.string(),
    floorNo: Yup.string(),
    totalBlockFloors: Yup.number()
      .nullable()
      .min(0, "Only positive values are accepted")
      .typeError("The value must be a valid number"),
    // Address
    uprn: Yup.string(),
    postPreamble: Yup.string(),
    addressLine1: Yup.string().required("Address line 1 is a required field"),
    addressLine2: Yup.string(),
    addressLine3: Yup.string(),
    addressLine4: Yup.string(),
    postcode: Yup.string()
      .trim()
      .transform(removeWhitespace)
      .required("Postcode is a required field")
      .matches(regexUkPostcode, "Please enter a valid postcode"),

    // Property management
    agent: Yup.string(),
    areaOfficeName: Yup.string(),
    isCouncilProperty: Yup.string().required("Please select an option"),
    managingOrganisation: Yup.string().required(
      "Managing organisation is a required field",
    ),
    isTMOManaged: Yup.string().required("Please select an option"),
    patches: Yup.array()
      .of(
        Yup.object().shape({
          id: Yup.string(),
          value: Yup.string().nullable(),
        }),
      )
      .nullable(),

    // Asset details
    numberOfBedrooms: Yup.number()
      .nullable()
      .min(0, "Only positive values are accepted")
      .typeError("The value must be a valid number"),
    numberOfLivingRooms: Yup.number()
      .nullable()
      .min(0, "Only positive values are accepted")
      .typeError("The value must be a valid number"),
    numberOfLifts: Yup.number()
      .nullable()
      .min(0, "Only positive values are accepted")
      .typeError("The value must be a valid number"),
    windowType: Yup.string(),
    yearConstructed: Yup.number()
      .nullable()
      .min(1800, "The year entered is invalid")
      .typeError("The value must be a valid number"),
  });

export type NewPropertyFormData = Yup.Asserts<ReturnType<typeof newPropertySchema>>;
