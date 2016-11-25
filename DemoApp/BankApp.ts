import { Bank } from "./Models/Bank";
import { AccountType, Account } from "./Models/Account";
import { HomeController } from "./Controllers/HomeController";
import { AccountController } from "./Controllers/AccountController";
import { TransactionController } from "./Controllers/TransactionController";
import { SupportController } from "./Controllers/SupportController";
import * as Storage from "./Utils/Storage";

export class BankApp extends MvcRouter.App {
    private bank;

    constructor(appBody: HTMLElement) {
        super({
            appBody: appBody
        });

        const router = this.getRouter();
        router.addRoute("/", HomeController);
        router.addRoute("/account/:type", AccountController);
        router.addRoute("/account/:type/:mode", TransactionController);
        router.addRoute("/support", SupportController);

        this.load();
    }

    public getBank(): Bank {
        if (!this.bank) {
            const checkingAccountBalance = parseInt(Storage.load(AccountType[AccountType.Checking]) || '1000', 10);
            const savingsAccountBalance = parseInt(Storage.load(AccountType[AccountType.Savings]) || '5000', 10);
            this.bank = new Bank(checkingAccountBalance, savingsAccountBalance);
        }
        return this.bank;
    }
}
