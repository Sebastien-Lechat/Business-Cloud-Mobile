import { ArticleI } from './articleInterface';
import { EstimateI } from './estimateInterface';
import { ClientI, ShortUserListI } from './userInterface';

export interface FileI<T extends (BillI | EstimateI)> {
    data: T;
}

export interface BillI {
    billNum: string;
    id: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    enterpriseId: string;
    articles: BillArticleI[];
    reduction: number;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    amountPaid?: number;
    payementDate?: Date;
    createdAt: Date;
    updatedAt: Date;
}

export interface BillCreateI {
    billNum: string;
    status: string;
    clientId: string;
    enterpriseId: string;
    articles: BillArticleI[];
    reduction: number;
    totalHT: number;
    totalTTC: number;
    deadline: Date;
    amountPaid?: number;
    payementDate?: Date;
}

export interface BillArticleI {
    articleId: string | ArticleI;
    quantity: number;
}
