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
    deadline: string;
    createdAt: Date;
    updatedAt: Date;
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

export interface EstimateArticleI {
    articleId: string | ArticleI;
    quantity: number;
}
