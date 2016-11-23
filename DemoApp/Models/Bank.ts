import { AccountType, Account } from "./Account";

export class Bank {
    private checkingAccount: Account;
    private savingsAccount: Account;

    constructor() {
        this.checkingAccount = new Account(AccountType.Checking);
        this.savingsAccount = new Account(AccountType.Savings);
    }

    public getAccounts(): Account[] {
        const accounts = <Account[]>[];
        accounts.push(this.checkingAccount);
        accounts.push(this.savingsAccount);
        return accounts;
    }

    public getAccount(accountType: number): Account {
        if (accountType == AccountType.Checking) {
            return this.checkingAccount;
        }
        else {
            return this.savingsAccount;
        }
    }
}
