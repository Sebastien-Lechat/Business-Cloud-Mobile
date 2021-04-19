import { ArticleI } from './articleInterface';
import { ClientI } from './userInterface';
export interface EstimateI {
    estimateNum: string;
    id: string;
    status: string;
    clientId: string | ClientI;
    enterpriseId: string;
    articles: EstimateArticleI[];
    currency?: string;
    totalHT: number;
    totalTTC: number;
    deadline: string;
    createdAt: Date;
    updatedAt: Date;
}

export interface EstimateArticleI {
    articleId: string | ArticleI;
    quantity: number;
}
