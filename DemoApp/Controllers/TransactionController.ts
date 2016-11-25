import { ControllerBase } from "./ControllerBase";
import { AccountType, Account } from "../Models/Account";
import { BankApp } from "../BankApp";
import { MessageBox } from "../Dialogs/MessageBox";
import * as Storage from "../Utils/Storage";
import { TransactionPageProps, TransactionPage, TransactionPageState, TransactionPageLabels } from "../Views/TransactionPage";

export class TransactionController extends ControllerBase {
    private accountType: number;
    private depositing: boolean;
    private account: Account;
    private component: React.Component<TransactionPageProps, TransactionPageState>;

    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        // Get data based on query parameters
        this.accountType = parseInt(params["type"], 10);
        this.account = this.app.getBank().getAccount(this.accountType);
        this.depositing = (params["mode"] === "deposit");

        // Render page
        const props: TransactionPageProps = {
            labels: this.depositing ? TransactionController.depositLabels : TransactionController.withdrawalLabels,
            accountName: this.account.getName()
        };
        const element = React.createElement<TransactionPageProps>(TransactionPage, props);
        this.component = ReactDOM.render<TransactionPageProps, TransactionPageState>(element, this.$pageContainer.get(0), () => {
            this.attachPageEventHandlers();
        });
        this.component.setState({ balance: this.account.getBalance() });
    }

    private attachPageEventHandlers(): void {
        this.$pageContainer.on('click', '.ok-button', () => this.onOkClicked());
        this.$pageContainer.on('click', '.cancel-button', () => this.onCancelClicked());
    }

    private onOkClicked(): void {
        if (this.depositing) {
            this.performDeposit();
        }
        else {
            this.performWithdrawal();
        }
    }

    private performDeposit(): void {
        const amountStr = this.$pageContainer.find('.amount-input').val();
        const amount = parseInt(amountStr, 10);
        this.account.depositMoney(amount);

        Storage.store(AccountType[this.accountType], this.account.getBalance().toString());

        this.component.setState({ balance: this.account.getBalance() });
        MessageBox.show("Amount deposited.").done(() => {
            this.app.navigate("/");
        });
    }

    private performWithdrawal(): void {
        const amountStr = this.$pageContainer.find('.amount-input').val();
        const amount = parseInt(amountStr, 10);
        try {
            this.account.withdrawMoney(amount);

            Storage.store(AccountType[this.accountType], this.account.getBalance().toString());

            this.component.setState({ balance: this.account.getBalance() });
            MessageBox.show("Amount withdrawn.").done(() => {
                this.app.navigate("/");
            });
        }
        catch (ex) {
            MessageBox.show(ex.message);
        }
    }

    private onCancelClicked(): void {
        this.app.navigate(`/account/${this.accountType}`);
    }

    private static depositLabels: TransactionPageLabels = {
        transactionType: "Deposit",
        prompt: "How much do you want to deposit?"
    };

    private static withdrawalLabels: TransactionPageLabels = {
        transactionType: "Withdrawal",
        prompt: "How much do you want to withdraw?"
    };
}
