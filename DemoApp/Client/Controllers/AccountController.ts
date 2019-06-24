import * as React from "react";
import * as ReactDOM from "react-dom";
import * as MvcRouter from "mvc-router-spa";
import { ControllerBase } from "./ControllerBase";
import { Account } from "../Models/Account";
import { BankApp } from "../BankApp";
import { AccountPageProps, AccountPage, AccountPageState } from "../Views/AccountPage";

export class AccountController extends ControllerBase {
    private accountType: number;
    private account: Account;
    private accountPage: AccountPage;

    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        // Get data based on query parameters.
        this.accountType = parseInt(params["type"], 10);
        this.account = this.app.getBank().getAccount(this.accountType);

        // Render page.
        const props: AccountPageProps = {
            account: this.account,
            onDepositClicked: () => this.onDepositClicked(),
            onWithdrawClicked: () => this.onWithdrawClicked(),
            ref: component => {
                if (component) {
                    this.accountPage = component;
                }
            }
        };
        ReactDOM.render(React.createElement(AccountPage, props), this.pageContainer, () => {
            this.initPage();
        });
    }

    private initPage(): void {
        // do ajax calls here
    }

    private onDepositClicked(): void {
        this.app.navigate(`/account/${this.accountType}/deposit`);
    }

    private onWithdrawClicked(): void {
        this.app.navigate(`/account/${this.accountType}/withdrawal`);
    }
}
