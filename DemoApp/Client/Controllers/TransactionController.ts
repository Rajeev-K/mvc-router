import * as React from "react";
import * as ReactDOM from "react-dom";
import * as MvcRouter from "mvc-router-spa";
import { ControllerBase } from "./ControllerBase";
import { AccountType, Account } from "../Models/Account";
import { BankApp } from "../BankApp";
import { MessageBox } from "../Dialogs/MessageBox";
import * as Storage from "../Utils/Storage";
import { TransactionPageProps, TransactionPage, TransactionPageLabels } from "../Views/TransactionPage";

export class TransactionController extends ControllerBase {
    private accountType: number;
    private depositing: boolean;
    private account: Account;
    private transactionPage: TransactionPage;

    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        // Get data based on query parameters
        this.accountType = parseInt(params["type"], 10);
        this.depositing = (params["mode"] === "deposit");

        // Render page
        const props: TransactionPageProps = {
            labels: this.depositing ? depositLabels : withdrawalLabels,
            onOkClicked: () => this.onOkClicked(),
            onCancelClicked: () => this.onCancelClicked(),
            ref: component => {
                if (component) {
                    this.transactionPage = component;
                }
            }
        };
        ReactDOM.render(React.createElement(TransactionPage, props), this.pageContainer, () => {
            this.initPage();
        });
    }

    private initPage(): void {
        // do ajax calls here
        this.account = this.app.getBank().getAccount(this.accountType);
        this.transactionPage.setAccountName(this.account.getName());
        this.transactionPage.setBalance(this.account.getBalance());
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
        const amount = this.transactionPage.getAmount();
        this.account.depositMoney(amount);

        Storage.store(AccountType[this.accountType], this.account.getBalance().toString());

        this.transactionPage.setBalance(this.account.getBalance());
        MessageBox.show("Amount deposited.").then(() => {
            this.app.navigate("/");
        });
    }

    private performWithdrawal(): void {
        const amount = this.transactionPage.getAmount();
        try {
            this.account.withdrawMoney(amount);

            Storage.store(AccountType[this.accountType], this.account.getBalance().toString());

            this.transactionPage.setBalance(this.account.getBalance());
            MessageBox.show("Amount withdrawn.").then(() => {
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
}

const depositLabels: TransactionPageLabels = {
    transactionType: "Deposit",
    prompt: "How much do you want to deposit?"
};

const withdrawalLabels: TransactionPageLabels = {
    transactionType: "Withdrawal",
    prompt: "How much do you want to withdraw?"
};
