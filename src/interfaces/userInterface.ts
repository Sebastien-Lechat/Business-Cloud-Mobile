export interface UserObject {
    data: UserI | ClientI;
    type: 'client' | 'user';
}

export interface UserI {
    name: string;
    email: string;
    phone?: string;
    password: string;
    avatar?: string;
    birthdayDate?: string;
    token?: string;
    refreshToken?: string;
    currency?: string;
    role?: string;
    isActive?: boolean;
}

export interface ClientI extends UserI {
    activity?: any;
    address?: string;
    zip?: string;
    city?: string;
    country?: string;
    numTVA?: string;
    numSIRET?: string;
    numRCS?: string;
    userId?: string;
}
