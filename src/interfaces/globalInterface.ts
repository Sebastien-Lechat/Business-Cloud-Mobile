export interface FacebookDataI {
    id: string;
    email: string;
    name: string;
    birthday: string;
    picture: {
        data: {
            width: number,
            height: number,
            url: number
        }
    };
}

export interface GoogleDataI {
    id: string;
    idToken: string;
    imageUrl: string;
    email: string;
    familyName: string;
    givenName: string;
}

export interface HistoryI {
    _id: string;
    action: {
        name?: string;
        method: string;
        route: string;
    };
    userEmail: string;
    success: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

export interface StatisticI {
    gainTotal?: number;
    expenseTotal?: number;
    employeeTotal?: number;
    customerTotal?: number;
    projectTotal?: number;
    projectTimeTotal?: number | string;
    billUnpaidTotal?: number;
    billUnpaidAmountTotal?: number;
}
