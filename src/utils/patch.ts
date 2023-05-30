class PropertyPatch {
  id: number;
  value: string | undefined;
  
  constructor(id: number, value?: string) {
    this.id = id
    this.value = value
  }
}

export default PropertyPatch