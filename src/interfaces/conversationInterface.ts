export interface ConvI {
    _id: string;
    member1: { type: string, user: { _id: string, name: string, socketToken: string } };
    member2: { type: string, user: { _id: string, name: string, socketToken: string } };
    createdAt: Date | string;
    updatedAt: Date | string;
    lastMessage?: { text: string, user: string };
}

export interface ConvJsonI {
    id: string;
    member1: { type: string, user: { _id: string, name: string, avatar?: string, socketToken: string } };
    member2: { type: string, user: { _id: string, name: string, avatar?: string, socketToken: string } };
    createdAt: Date | string;
    updatedAt: Date | string;
    otherId?: string;
    otherAvatar?: any;
    otherName?: string;
    lastMessage?: { text: string, user: string };
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
