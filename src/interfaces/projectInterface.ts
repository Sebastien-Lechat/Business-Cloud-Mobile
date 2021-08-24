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
    employees: { id: string }[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    billing?: { billableTime?: number, additionalExpense?: number };
    createdAt: Date;
    updatedAt: Date;
}

export interface ProjectCreateI {
    projectNum: string;
    title: string;
    status: string;
    clientId: string;
    progression: number;
    startDate: Date;
    deadline: Date;
    employees: { id: string }[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    description?: string;
}

export interface ProjectUpdateI {
    id?: string;
    title?: string;
    status?: string;
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
    employees: { id: string }[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    billing?: { billableTime?: number, additionalExpense?: number };
    description?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
    total?: string | number;
    totalHours?: string | number;
}
