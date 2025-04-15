import React, { useEffect, useState } from "react";
import { Link as RouterLink } from "react-router-dom";

import Cookies from "js-cookie";

import { locale } from "../../services";
import { isAuthorisedForGroups } from "@mtfh/common/lib/auth";
import { patchAdminAuthGroups } from "../../services/config/config";

import { getAllPatchesAndAreas, getByPatchName, Patch } from "@mtfh/common/lib/api/patch/v1";
import {
  Button,
  Heading,
  SummaryList,
  SummaryListItem,
} from "@mtfh/common/lib/components";
import { updatePropertyPatch, UpdatePropertyPatchRequest } from "@mtfh/common/lib/api/asset/v1";
import { EditAssignmentButton, CancelReassignmentButton, ConfirmReassignmentButton } from "../patch-assignment-form/components/form-buttons";
interface PatchDetailsProps {
  assetPk: string;
  assetPatch?: Patch;
  assetArea?: Patch;
  versionNumber?: number;
}

export const buildUpdatePropertyPatchRequest = (
  patchId: string,
  areaId: string
): UpdatePropertyPatchRequest => ({
  patchId,
  areaId
});

export const PatchDetails = ({ assetPk, assetPatch, assetArea, versionNumber }: PatchDetailsProps) => {
  const { heading } = locale.patchDetails;

  const { patchLabel, housingOfficerLabel, areaManagerLabel } = locale.patchDetails;

  const patchOrAreaDefined = assetPatch || assetArea;
  const housingOfficerName = assetPatch?.responsibleEntities[0]?.name;
  const areaManagerName = assetArea?.responsibleEntities[0]?.name;
  const [newPatchName, setNewPatchName] = useState<string>();
  const [isEditingPatchName, setIsEditingPatchName] = useState(false);
  const [patchesAndAreas, setPatchesAndAreas] = useState<Patch[]>([]);


  useEffect(() => {
    getAllPatchesAndAreas().then((data) => {
      setPatchesAndAreas(data.filter(
        (patchOrArea) =>
          ![
            "Hackney",
            "CL Area",
            "CP Area",
            "HN1 Area",
            "HN2 Area",
            "SD Area",
            "SH Area",
            "SN Area",
          ].includes(patchOrArea.name),
      ));
    });
  }, []);


  const updatePropertyPatchCall = (request: UpdatePropertyPatchRequest) => {
    updatePropertyPatch(assetPk, request, versionNumber?.toString() ?? "")
      .catch((err) => {
        console.error(err);
      })
      .finally(() => {
        window.location.reload();
      });  
  }
  const getbyPatchNameCall = (patchName: string) => {
    getByPatchName(patchName)
    .then((data) => { 
      const id = JSON.stringify(data).match(/"id":"(.*?)"/);
      const parentId = JSON.stringify(data).match(/"parentId":"(.*?)"/);
      console.log("id L84", id)
      console.log("parentId L85", parentId)
      if (!id?.[1] || !parentId?.[1]) {
        throw new Error("Invalid patch data: id or parentId is undefined");
      }
      const request = buildUpdatePropertyPatchRequest(id[1], parentId[1]);
      updatePropertyPatchCall(request);
      })
    .catch((err) => {
      console.error(err);
    });
      
  }
  const handleEdit = () => {
    console.log("newPatchName", newPatchName)
    if (newPatchName) {
      getbyPatchNameCall(newPatchName)
    }
  }

  function SetPatchNameOption() {
    return (
      <div className="patch" key={"patchName"}>
          <select
            id={`patch-dropdown-options`}
            className="govuk-input lbh-input"
            data-testid={`patch-dropdown-options`}
            value ={newPatchName}
            onChange={(e) => setNewPatchName(e.target.value)}
          >
            <option disabled value="">
                {" "}
                -- Select an option --{" "}
            </option>
            <option selected>
              {assetPatch?.name}
            </option>
            {patchesAndAreas
              .filter((patchOrArea) => patchOrArea.patchType === "patch")
              .sort((a, b) => (a.name > b.name ? 1 : -1))
              .map(({ name }) => (
                <option key={name} value={name}>
                  {name}     
                </option>
            ))}
            
          </select>
      </div>
    );
  };

  return (
    <>
      <aside className="mtfh-patch-details">
        <Heading variant="h2" className="lbh-heading lbh-heading-h3">
          {heading}
        </Heading>

        {patchOrAreaDefined ? (
          <SummaryList overrides={[2 / 3]}>
            <SummaryListItem title={patchLabel} data-testid="patch-name" key="patchName">
              {assetPatch?.name}
            </SummaryListItem>
            <SummaryListItem
              title={housingOfficerLabel}
              data-testid="officer-name"
              key="officerName"
            >
              {housingOfficerName || "N/A"}
            </SummaryListItem>
            <SummaryListItem
              title={areaManagerLabel}
              data-testid="area-manager-name"
              key="areaManagerName"
            >
              {areaManagerName || "N/A"}
            </SummaryListItem>
          </SummaryList>
        ) : (
          <p>{locale.patchDetails.noPatch}</p>
        )}
        {isAuthorisedForGroups(patchAdminAuthGroups) && (
          !isEditingPatchName ?
            <EditAssignmentButton onClick={() => setIsEditingPatchName(true)} />  
            :  <SetPatchNameOption />
        
        )}
        {isAuthorisedForGroups(patchAdminAuthGroups) && (
          isEditingPatchName &&<ConfirmReassignmentButton 
            onClick={handleEdit}
            enabled= {true} 
          />
        )} 
        {isAuthorisedForGroups(patchAdminAuthGroups) && (
          isEditingPatchName && <CancelReassignmentButton onClick={() => setIsEditingPatchName(false)} />
        )}
        <Button
          as={RouterLink}
          to="/property/all-patches-and-areas"
          data-testid="all-patches-and-areas-button"
          onClick={() => Cookies.set("fromAssetId", assetPk)}
        >
          {locale.patchDetails.allPatchesAndAreas}
        </Button>
      </aside>
      <hr className="lbh-horizontal-bar" />
    </>
  );
};
