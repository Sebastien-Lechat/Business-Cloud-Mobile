export interface UserExpenseI {
    userExpenseNum: string;
    _id?: string;
    price: number;
    category: string;
    file: string;
    description: string;
    userId: string;
    accountNumber: number;
    createdAt: Date;
    updatedAt: Date;
}

export interface UserExpenseJsonI {
    userExpenseNum: string;
    id: string;
    price: number;
    category: string;
    file: string;
    description: string;
    userId: string;
    accountNumber: number;
    createdAt: Date;
    updatedAt: Date;
}
