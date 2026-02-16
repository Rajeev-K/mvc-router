import * as React from "react";
import { createRoot } from "react-dom/client";
import * as MvcRouter from "mvc-router-spa";
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
        this.pageRoot = createRoot(this.pageContainer);
        this.pageRoot.render(React.createElement(HomePage, props));
    }
}
