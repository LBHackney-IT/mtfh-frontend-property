export interface HouseholdMember {
    id: string;
    fullName: string;
    isResponsible: boolean;
}

export enum AssetType {
    DWELLING = 'Dwelling',
    GARAGE = 'Garage',
}

export interface TenureAsset {
    id: string;
    type: AssetType;
    fullAddress: string;
    uprn: string;
}

export interface TenureType {
    code: string;
    description: string;
}

export interface Tenure {
    id: string;
    paymentReference: string;
    propertyReference: string;
    startOfTenureDate: string;
    endOfTenureDate: string;
    isActive: boolean;
    tenureType: TenureType;
    tenuredAsset: TenureAsset;
}
