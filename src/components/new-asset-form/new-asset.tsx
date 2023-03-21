import { Field, Form, Formik } from "formik";
import { Link as RouterLink } from "react-router-dom";
import React, { useState } from "react";
import { NewPropertyFormData, newPropertySchema } from "./schema";
import "./styles.scss";

export const NewAsset = (): JSX.Element => {

    const [submitEditEnabled, setSubmitEditEnabled] = useState<boolean>(true);

    return (
        <>
            <Formik<NewPropertyFormData>
                initialValues={{
                    assetId: '',
                    assetType: '',
                    propertyEstate: '',
                    propertyBlock: '',
                    propertySubBlock: '',
                    floorNo: '',
                    totalBlockFloors: '',
                    uprn: '',
                    addressLine1: '',
                    addressLine2: '',
                    addressLine3: '',
                    addressLine4: '',
                    postcode: '',
                    agent: '',
                    areaOfficeName: '',
                    isCouncilProperty: '',
                    managingOrganisation: '',
                    isTMOManaged: '',
                    numberOfBedrooms: '',
                    numberOfLivingRooms: '',
                    numberOfLifts: '',
                    windowType: '',
                    yearConstructed: '',
                }}
                validationSchema={newPropertySchema}
                onSubmit={(values) => console.log('VALUES', values)}
            >
                {({ errors }) => (

                    <div id="new-property-form">
                        <Form>
                            <label className="govuk-label lbh-label" htmlFor="asset-id">
                                Asset ID
                            </label>
                            <Field
                                id="asset-id"
                                name="assetId"
                                className="govuk-input lbh-input"
                                type="text"
                                data-testid="asset-id"
                            />
                            <label className="govuk-label lbh-label" htmlFor="asset-type">
                                Asset Type
                            </label>
                            <Field
                                as="select"
                                id="asset-type"
                                name="assetType"
                                className="govuk-input lbh-input"
                                data-testid="asset-type">
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </Field>
                            <label className="govuk-label lbh-label" htmlFor="property-estate">
                                Estate this property is in
                            </label>
                            <Field
                                as="select"
                                id="property-estate"
                                name="propertyEstate"
                                className="govuk-input lbh-input"
                                data-testid="property-estate">
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </Field>
                            <label className="govuk-label lbh-label" htmlFor="property-block">
                                Block this property is in
                            </label>
                            <Field
                                as="select"
                                id="property-block"
                                name="propertyBlock"
                                className="govuk-input lbh-input"
                                data-testid="property-block">
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </Field>
                            <label className="govuk-label lbh-label" htmlFor="property-sub-block">
                                Sub-block this property is in
                            </label>
                            <Field
                                as="select"
                                id="property-sub-block"
                                name="propertySubBlock"
                                className="govuk-input lbh-input"
                                data-testid="property-sub-block">
                                <option value="red">Red</option>
                                <option value="green">Green</option>
                                <option value="blue">Blue</option>
                            </Field>
                            <label className="govuk-label lbh-label" htmlFor="floor-no">
                                Floor this property is on
                            </label>
                            <Field
                                id="floor-no"
                                name="floorNo"
                                className="govuk-input lbh-input"
                                data-testid="floor-no"
                            />

                            <label className="govuk-label lbh-label" htmlFor="total-block-floors">
                                Number of floors in block
                            </label>
                            <Field
                                id="total-block-floors"
                                name="totalBlockFloors"
                                className="govuk-input lbh-input"
                                data-testid="total-block-floors"
                            />
                            <h2 className="lbh-heading-h2">
                                Address
                            </h2>
                            <label className="govuk-label lbh-label" htmlFor="uprn">
                                UPRN
                            </label>
                            <Field
                                id="uprn"
                                name="uprn"
                                className="govuk-input lbh-input"
                                data-testid="uprn"
                            />

                            <label className="govuk-label lbh-label" htmlFor="address-line-1">
                                Address line 1
                            </label>
                            <Field
                                id="address-line-1"
                                name="addressLine1"
                                className="govuk-input lbh-input"
                                data-testid="address-line-1"
                            />
                            <label className="govuk-label lbh-label" htmlFor="address-line-2">
                                Address line 2
                            </label>
                            <Field
                                id="address-line-2"
                                name="addressLine2"
                                className="govuk-input lbh-input"
                                data-testid="address-line-2"
                            />
                            <label className="govuk-label lbh-label" htmlFor="address-line-3">
                                Address line 3
                            </label>
                            <Field
                                id="address-line-3"
                                name="addressLine3"
                                className="govuk-input lbh-input"
                                data-testid="address-line-3"
                            />
                            <label className="govuk-label lbh-label" htmlFor="address-line-4">
                                Address line 4
                            </label>
                            <Field
                                id="address-line-4"
                                name="addressLine4"
                                className="govuk-input lbh-input"
                                data-testid="address-line-4"
                            />
                            <label className="govuk-label lbh-label" htmlFor="postcode">
                                Postcode
                            </label>
                            <Field
                                id="postcode"
                                name="postcode"
                                className="govuk-input lbh-input"
                                data-testid="postcode"
                            />
                            <h2 className="lbh-heading-h2">
                                Property management
                            </h2>
                            <label className="govuk-label lbh-label" htmlFor="agent">
                                Agent
                            </label>
                            <Field
                                id="agent"
                                name="agent"
                                className="govuk-input lbh-input"
                                data-testid="agent"
                            />
                            <label className="govuk-label lbh-label" htmlFor="area-office-name">
                                Area office name
                            </label>
                            <Field
                                id="area-office-name"
                                name="areaOfficeName"
                                className="govuk-input lbh-input"
                                data-testid="area-office-name"
                            />
                            <div className="govuk-form-group lbh-form-group">
                                <fieldset className="govuk-fieldset">
                                    <legend className="govuk-label lbh-label">Is LBH property?</legend>
                                    <div className="govuk-radios lbh-radios">
                                        <div className="govuk-radios__item">
                                            <Field
                                                className="govuk-radios__input"
                                                id="is-council-property-yes"
                                                name="isCouncilProperty"
                                                type="radio"
                                                value="Yes"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="is-council-property-yes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="govuk-radios__item">
                                            <Field
                                                className="govuk-radios__input"
                                                id="is-council-property-no"
                                                name="isCouncilProperty"
                                                type="radio"
                                                value="No"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="is-council-property-no">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <label className="govuk-label lbh-label" htmlFor="managing-organisation">
                                Managing organisation
                            </label>
                            <Field
                                id="managing-organisation"
                                name="managingOrganisation"
                                className="govuk-input lbh-input"
                                data-testid="managing-organisation"
                            />
                            <div className="govuk-form-group lbh-form-group">
                                <fieldset className="govuk-fieldset">
                                    <legend className="govuk-label lbh-label">Is TMO managed?</legend>
                                    <div className="govuk-radios lbh-radios">
                                        <div className="govuk-radios__item">
                                            <Field
                                                className="govuk-radios__input"
                                                id="is-tmo-managed-yes"
                                                name="isTMOManaged"
                                                type="radio"
                                                value="Yes"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="is-tmo-managed-yes">
                                                Yes
                                            </label>
                                        </div>
                                        <div className="govuk-radios__item">
                                            <Field
                                                className="govuk-radios__input"
                                                id="is-tmo-managed-no"
                                                name="isTMOManaged"
                                                type="radio"
                                                value="No"
                                            />
                                            <label className="govuk-label govuk-radios__label" htmlFor="is-tmo-managed-no">
                                                No
                                            </label>
                                        </div>
                                    </div>
                                </fieldset>
                            </div>
                            <h2 className="lbh-heading-h2">
                                Asset details
                            </h2>
                            <label className="govuk-label lbh-label" htmlFor="no-of-bedrooms">
                                Number of bedrooms
                            </label>
                            <Field
                                id="no-of-bedrooms"
                                name="numberOfBedrooms"
                                className="govuk-input lbh-input"
                                data-testid="no-of-bedrooms"
                            />
                            <label className="govuk-label lbh-label" htmlFor="no-of-living-rooms">
                                Number of living rooms
                            </label>
                            <Field
                                id="no-of-living-rooms"
                                name="numberOfLivingRooms"
                                className="govuk-input lbh-input"
                                data-testid="no-of-living-rooms"
                            />
                            <label className="govuk-label lbh-label" htmlFor="no-of-lifts">
                                Number of lifts
                            </label>
                            <Field
                                id="no-of-lifts"
                                name="numberOfLifts"
                                className="govuk-input lbh-input"
                                data-testid="no-of-lifts"
                            />
                            <label className="govuk-label lbh-label" htmlFor="window-type">
                                Window type
                            </label>
                            <Field
                                id="window-type"
                                name="windowType"
                                className="govuk-input lbh-input"
                                data-testid="window-type"
                            />
                            <label className="govuk-label lbh-label" htmlFor="year-constructed">
                                Year constructed
                            </label>
                            <Field
                                id="year-constructed"
                                name="yearConstructed"
                                className="govuk-input lbh-input"
                                data-testid="year-constructed"
                            />
                            <div className="new-property-form-actions">
                                <button
                                    className="govuk-button lbh-button"
                                    data-module="govuk-button"
                                    type="submit"
                                    id="submit-new-property-button"
                                    disabled={!submitEditEnabled}
                                >
                                    Create new property
                                </button>

                                <RouterLink
                                    to={"#"}
                                    className="govuk-button govuk-secondary lbh-button lbh-button--secondary"
                                    id="cancel-new-property-button"
                                >
                                    Cancel
                                </RouterLink>
                            </div>
                        </Form>
                    </div>
                )}
            </Formik>
        </>
    )
}