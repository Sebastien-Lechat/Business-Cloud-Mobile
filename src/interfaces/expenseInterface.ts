export interface ExpenseI {
    expenseNum: string;
    _id?: string;
    price: number;
    accountNumber: number;
    category: string;
    file: string;
    description: string;
    userId: string;
    projectId?: string;
    billable: boolean;
    createdAt: Date;
    updatedAt: Date;
}

export interface ExpenseCreateI {
    expenseNum: string;
    price: number;
    accountNumber: number;
    category: string;
    file?: string;
    description?: string;
    projectId?: string;
    billable: boolean;
}

export interface ExpenseJsonI {
    expenseNum: string;
    id: string;
    price: number;
    accountNumber: number;
    category: string;
    file: string;
    description: string;
    userId: string;
    projectId?: string;
    billable: boolean;
    createdAt: Date | string;
    updatedAt: Date | string;
}

