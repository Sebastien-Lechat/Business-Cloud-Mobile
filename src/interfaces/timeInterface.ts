export interface TimeI {
    _id?: string;
    userId: string;
    taskId: string;
    projectId: string;
    billable: boolean;
    duration: number;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface TimeJsonI {
    id: string;
    userId: { name: string, _id: string };
    taskId?: string;
    projectId: string;
    billable: boolean;
    duration: number;
    durationFormated?: string;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface TimeCreateI {
    userId: string;
    taskId?: string;
    projectId: string;
    billable: boolean;
    duration: number;
}
