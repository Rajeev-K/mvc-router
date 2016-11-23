import { ControllerBase } from "./ControllerBase";
import { Account } from "../Models/Account";
import { BankApp } from "../BankApp";
import { AccountPageProps, AccountPage } from "../Views/AccountPage";

export class AccountController extends ControllerBase {
    private accountType: number;
    private account: Account;

    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        // Get data based on query parameters.
        this.accountType = parseInt(params["type"], 10);
        this.account = this.app.getBank().getAccount(this.accountType);

        // Render page.
        const props: AccountPageProps = {
            account: this.account
        };
        const element = React.createElement(AccountPage, props);
        ReactDOM.render(element, this.$pageContainer.get(0), () => {
            this.attachPageEventHandlers();
        });
    }

    private attachPageEventHandlers(): void {
        this.$pageContainer.on('click', '.widthdraw-button', () => this.onWithdrawClicked());
        this.$pageContainer.on('click', '.deposit-button', () => this.onDepositClicked());
    }

    private onDepositClicked(): void {
        this.app.navigate(`/account/${this.accountType}/deposit`);
    }

    private onWithdrawClicked(): void {
        this.app.navigate(`/account/${this.accountType}/withdrawal`);
    }
}
