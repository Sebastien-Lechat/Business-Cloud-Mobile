import { ShortUserListI } from './userInterface';

export interface ProjectI {
    projectNum: string;
    _id?: string;
    title: string;
    status: string;
    clientId: ShortUserListI;
    progression: number;
    startDate: string;
    deadline: string;
    employees: string[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectJsonI {
    projectNum: string;
    id: string;
    title: string;
    status: string;
    clientId: ShortUserListI;
    progression: number;
    startDate: string;
    deadline: string;
    employees: string[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    createdAt: Date;
    updatedAt: Date;
}
