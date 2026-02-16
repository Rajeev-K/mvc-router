import * as React from "react";
import { createRoot } from "react-dom/client";
import * as MvcRouter from "mvc-router-spa";
import { ControllerBase } from "./ControllerBase";
import { BankApp } from "../BankApp";
import { MessageBox } from "../Dialogs/MessageBox";
import { SupportPage, SupportPageProps } from "../Views/SupportPage";

export class SupportController extends ControllerBase {
    private supportPage: SupportPage;

    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        const props: SupportPageProps = {
            onSendButtonClicked: () => this.onSendButtonClicked(),
            ref: component => {
                if (component) {
                    this.supportPage = component;
                    this.initPage();
                }
            }
        };
        this.pageRoot = createRoot(this.pageContainer);
        this.pageRoot.render(React.createElement(SupportPage, props));
    }

    private initPage(): void {
        // do ajax calls here
    }

    private onSendButtonClicked(): void {
        MessageBox.show("Message has been sent!").then(() => {
            this.supportPage.clearMessage();
            this.app.navigate("/");
        });
    }
}
