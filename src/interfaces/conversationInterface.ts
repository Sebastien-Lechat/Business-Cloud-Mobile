export interface ConvI {
    _id: string;
    member1: { type: string, user: { _id: string, name: string, socketToken: string } };
    member2: { type: string, user: { _id: string, name: string, socketToken: string } };
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface ConvJsonI {
    id: string;
    member1: { type: string, user: { _id: string, name: string, socketToken: string } };
    member2: { type: string, user: { _id: string, name: string, socketToken: string } };
    createdAt: Date | string;
    updatedAt: Date | string;
}
export interface MessageI {
    _id?: string;
    conversationId: string;
    userId: string;
    text: string;
    createdAt: Date | string;
    updatedAt?: Date | string;
    seen: boolean;
}
