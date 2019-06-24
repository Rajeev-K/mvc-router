import * as React from "react";
import * as ReactDOM from "react-dom";
import { ControllerBase } from "./ControllerBase";
import { BankApp } from "../BankApp";
import { HomePageProps, HomePage } from "../Views/HomePage";

export class HomeController extends ControllerBase {
    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        const props: HomePageProps = {
            accounts: this.app.getBank().getAccounts()
        };
        ReactDOM.render(React.createElement(HomePage, props), this.pageContainer);
    }
}
