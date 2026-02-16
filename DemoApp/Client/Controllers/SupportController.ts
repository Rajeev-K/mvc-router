import { createRoot } from "react-dom/client";
import * as MvcRouter from "mvc-router-spa";
import { ControllerBase } from "./ControllerBase";
import { BankApp } from "../BankApp";
import { MessageBox } from "../Dialogs/MessageBox";
import { SupportPage, SupportPageProps, createSupportPage } from "../Views/SupportPage";

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
        this.pageRoot.render(createSupportPage(props));
    }

    private initPage(): void {
        // do ajax calls here
    }

    private async onSendButtonClicked(): Promise<void> {
        await MessageBox.show("Message has been sent!");
        this.supportPage.clearMessage();
        this.app.navigate("/");
    }
}
