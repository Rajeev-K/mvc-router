import { Bank } from "./Models/Bank";
import { HomeController } from "./Controllers/HomeController";
import { AccountController } from "./Controllers/AccountController";
import { TransactionController } from "./Controllers/TransactionController";
import { SupportController } from "./Controllers/SupportController";

export class BankApp extends MvcRouter.App {
    private bank = new Bank();

    constructor(appBody: HTMLElement) {
        super({
            appBody: appBody
        });

        var router = this.getRouter();
        router.addRoute("/", HomeController);
        router.addRoute("/account/:type", AccountController);
        router.addRoute("/account/:type/:mode", TransactionController);
        router.addRoute("/support", SupportController);

        this.load();
    }

    public getBank(): Bank {
        return this.bank;
    }
}
