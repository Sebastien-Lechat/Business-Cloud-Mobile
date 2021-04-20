export interface UserObject {
    data: UserI | ClientI;
    type: 'client' | 'user';
}

export interface UserI {
    type?: 'user' | 'client';
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
    needVerifyEmail?: boolean;
    doubleAuthentification?: boolean;
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

export interface ShortUserListI {
    type: string;
    id: string;
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
    createdAt: Date;
    updatedAt: Date;
    role?: string;
    userId?: string;
}

export interface UserInfoUpdateI { name?: string; email?: string; phone?: string; birthdayDate?: string; }

export interface UserPasswordUpdateI { email: string; oldPassword: string; newPassword: string; }

export interface UserDoubleAuthUpdateI { isActive: boolean; }
