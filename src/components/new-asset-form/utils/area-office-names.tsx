import React from "react";

const areaOfficeNames = [
  {
    areaOffice: "AN",
    officeName: "Temp Accommodation (Annexe)",
  },
  {
    areaOffice: "AR",
    officeName: "Arden Estate TMO (SH)",
  },
  {
    areaOffice: "BB",
    officeName: "Temp Accommodation (Bed & Breakfast)",
  },
  {
    areaOffice: "CL",
    officeName: "Clapton Park TMO (HN)",
  },
  {
    areaOffice: "CR",
    officeName: "Cranston Estate TMO (SH)",
  },
  {
    areaOffice: "CT",
    officeName: "Clapton Panel Area Team",
  },
  {
    areaOffice: "DO",
    officeName: "Downs TMO (SN)",
  },
  {
    areaOffice: "HL",
    officeName: "Temp Accommodation (Hostels)",
  },
  {
    areaOffice: "HN",
    officeName: "Homerton (1) Panel Area Team",
  },
  {
    areaOffice: "HT",
    officeName: "Homerton (2) Panel Area Team",
  },
  {
    areaOffice: "LO",
    officeName: "Lordship South TMO (SN)",
  },
  {
    areaOffice: "NE",
    officeName: "Stamford Hill Panel Area Team",
  },
  {
    areaOffice: "PL",
    officeName: "Temp Accommodation (Private Lease)",
  },
  {
    areaOffice: "QB",
    officeName: "Central Panel Area Team",
  },
  {
    areaOffice: "SH",
    officeName: "Shoreditch Panel Area Team",
  },
  {
    areaOffice: "SN",
    officeName: "Stoke Newington Panel Area Team",
  },
  {
    areaOffice: "SU",
    officeName: "Suffolk Estate TMO (CE)",
  },
  {
    areaOffice: "TO",
    officeName: "Tower TMO (CE)",
  },
  {
    areaOffice: "TR",
    officeName: "Travellers sites",
  },
  {
    areaOffice: "WE",
    officeName: "Wenlock Barn TMO (SH)",
  },
  {
    areaOffice: "WI",
    officeName: "Wick Village TMO (HN)",
  },
  {
    areaOffice: "WY",
    officeName: "Wyke TMO (HN)",
  },
];

const renderAreaOfficeNames = (): JSX.Element[] => {
  return areaOfficeNames.map((office, index) => (
    <option key={index} value={office.officeName}>
      {`${office.areaOffice} - ${office.officeName}`}
    </option>
  ));
};

export { areaOfficeNames, renderAreaOfficeNames };
