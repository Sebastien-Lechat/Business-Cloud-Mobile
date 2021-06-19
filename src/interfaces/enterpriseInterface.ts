export interface EnterpriseI {
    activity: any;
    address: string;
    zip: string;
    city: string;
    country: string;
    numTVA: string;
    numSIRET: string;
    numRCS: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EnterpriseUpdateI {
    activity?: any;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
}

export interface AddressUpdateI {
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
}
