import { ControllerBase } from "./ControllerBase";
import { Bank } from "../Models/Bank";
import { BankApp } from "../BankApp";
import { HomePageProps, HomePage } from "../Views/HomePage";

export class HomeController extends ControllerBase {
    constructor(app: BankApp) {
        super(app);
    }

    protected loadPage(params: MvcRouter.QueryParams): void {
        var props: HomePageProps = {
            accounts: this.app.getBank().getAccounts()
        };
        var element = React.createElement(HomePage, props);
        ReactDOM.render(element, this.$pageContainer.get(0));
    }
}
