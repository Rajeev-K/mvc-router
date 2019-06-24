export enum AccountType { Checking, Savings };

/** Represents a bank account */
export class Account {
    private name: string;

    constructor(private accountType: AccountType, private balance: number) {
        this.name = accountType === AccountType.Checking ? "Fee Maximizer Checking" : "Interest Free Savings";
        this.balance = balance;
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
        }
    }

    public withdrawMoney(amount: number): void {
        if (!isNaN(amount) && amount > 0) {
            if (amount > this.balance) {
                throw new Error("Amount exceeds balance");
            }
            this.balance = this.balance - amount;
        }
    }
}
