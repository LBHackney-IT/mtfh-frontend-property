class PropertyPatch {
  id: number;
  value: string;

  constructor(id: number, value: string = "") {
    // The ID is used for keeping track of Patch fields on the screen
    this.id = id;

    // The value is the GUID of the selected patch
    this.value = value;
  }
}

export default PropertyPatch;
