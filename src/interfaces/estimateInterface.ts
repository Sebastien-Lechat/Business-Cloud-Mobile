import { ArticleI } from './articleInterface';
import { ClientI, ShortUserListI } from './userInterface';
export interface EstimateI {
    estimateNum: string;
    id: string;
    status: string;
    clientId: string | ClientI | ShortUserListI;
    enterpriseId: string;
    articles: EstimateArticleI[];
    totalHT: number;
    totalTTC: number;
    reduction?: number;
    deadline: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface EstimateCreateI {
    estimateNum: string;
    status: string;
    clientId: string;
    enterpriseId: string;
    articles: EstimateArticleI[];
    reduction: number;
    totalHT: number;
    totalTTC: number;
    deadline: Date;
    amountPaid?: number;
    payementDate?: Date;
}

export interface EstimateUpdateI {
    id: string;
    estimateNum?: string;
    status?: string;
    articles?: { articleId: string, quantity: number }[];
    reduction?: number;
    deadline?: Date;
    amountPaid?: number;
    payementDate?: Date;
}

export interface EstimateArticleI {
    articleId: ArticleI;
    quantity: number;
}
