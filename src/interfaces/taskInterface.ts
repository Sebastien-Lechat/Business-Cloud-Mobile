export interface TaskI {
    _id?: string;
    name: string;
    progression: number;
    description: string;
    projectId: string;
    employees: string[];
    startDate: Date;
    deadline: Date;
    estimateHour: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TaskJsonI {
    id: string;
    name: string;
    progression: number;
    description: string;
    projectId: string;
    employees: string[];
    startDate: Date;
    deadline: Date;
    estimateHour: number;
    createdAt: Date;
    updatedAt: Date;
}

