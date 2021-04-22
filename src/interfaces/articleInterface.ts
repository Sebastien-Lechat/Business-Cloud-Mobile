export interface ArticleI {
    id?: string;
    _id?: string;
    name: string;
    price: number;
    accountNumber: number;
    tva: number;
    description?: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface ArticleCreateI {
    name: string;
    price: number;
    accountNumber: number;
    tva: number;
    description?: string;
}

