export interface TimeI {
    _id?: string;
    userId: string;
    taskId: string;
    projectId: string;
    billable: boolean;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface TimeJsonI {
    id: string;
    userId: string;
    taskId: string;
    projectId: string;
    billable: boolean;
    duration: number;
    createdAt: Date;
    updatedAt: Date;
}
