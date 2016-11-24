import * as Storage from "./Storage";

export enum AccountType { Checking, Savings };

/** Represents a bank account */
export class Account {
    private name: string;
    private balance: number;

    constructor(private accountType: AccountType) {
        if (accountType === AccountType.Checking) {
            this.name = "Fee Maximizer Checking";
            this.balance = parseInt(Storage.load(AccountType[this.accountType]) || '1000', 10);
        }
        else {
            this.name = "Interest Free Savings";
            this.balance = parseInt(Storage.load(AccountType[this.accountType]) || '5000', 10);
        }
    }

    public getAccountType(): AccountType {
        return this.accountType;
    }

    public getName(): string {
        return this.name;
    }

    public getBalance(): number {
        return this.balance;
    }

    public depositMoney(amount: number): void {
        if (!isNaN(amount) && amount > 0) {
            this.balance = this.balance + amount;
            Storage.store(AccountType[this.accountType], this.balance.toString());
        }
    }

    public withdrawMoney(amount: number): void {
        if (!isNaN(amount) && amount > 0) {
            if (amount > this.balance) {
                throw new Error("Amount exceeds balance");
            }
            this.balance = this.balance - amount;
            Storage.store(AccountType[this.accountType], this.balance.toString());
        }
    }
}
