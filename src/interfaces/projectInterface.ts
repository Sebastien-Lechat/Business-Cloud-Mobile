export interface ProjectI {
    projectNum: string;
    _id?: string;
    title: string;
    status: string;
    clientId: string;
    progression: number;
    startDate: Date;
    deadline: Date;
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
    clientId: string;
    progression: number;
    startDate: Date;
    deadline: Date;
    employees: string[];
    fixedRate?: number;
    hourlyRate?: number;
    estimateHour: number;
    createdAt: Date;
    updatedAt: Date;
}
