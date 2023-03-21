import * as Yup from "yup";

import { removeWhitespace } from "@mtfh/common/lib/utils";

export const regexUkPostcode =
  /^([A-Za-z][A-Ha-hJ-Yj-y]?[0-9][A-Za-z0-9]? ?[0-9][A-Za-z]{2}|[Gg][Ii][Rr] ?0[Aa]{2})$/;

export const newPropertySchema = () =>
  Yup.object({
    assetId: Yup.string().required("Asset ID is a required field"),
    assetType: Yup.string().required("Asset Type is a required field"),
    propertyEstate: Yup.string(),
    propertyBlock: Yup.string(),
    propertySubBlock: Yup.string(),
    floorNo: Yup.string(),
    totalBlockFloors: Yup.string(),

    // Address
    uprn: Yup.string(),
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
    managingOrganisation: Yup.string().required("Managing organisation is a required field"),
    isTMOManaged: Yup.string().required("Please select an option"),

    // Asset details
    numberOfBedrooms: Yup.string().test("bedrooms-no-check", "Input is invalid",
      (value) => { if (value) return isNaN(parseInt(value)) ? false : true }),
    numberOfLivingRooms: Yup.string(),
    numberOfLifts: Yup.string(),
    windowType: Yup.string(),
    yearConstructed: Yup.string(),
  });

export type NewPropertyFormData = Yup.Asserts<
  ReturnType<typeof newPropertySchema>
>;
