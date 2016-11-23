import { ControllerBase } from "./ControllerBase";
import { BankApp } from "../BankApp";
import { MessageBox } from "../Dialogs/MessageBox";
import { SupportPage } from "../Views/SupportPage";

export class SupportController extends ControllerBase {
    private $textArea: JQuery;

    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        var element = React.createElement(SupportPage, {});
        ReactDOM.render(element, this.$pageContainer.get(0), () => {
            this.$textArea = this.$pageContainer.find('textarea');
            this.$pageContainer.on('click', '.send-button', () => this.onSendButtonClicked());
        });
    }

    private onSendButtonClicked(): void {
        MessageBox.show("Message has been sent!").done(() => {
            this.$textArea.val('');
            this.app.navigate("/");
        });
    }
}
