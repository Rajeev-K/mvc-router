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
        const element = React.createElement(HomePage, props);
        ReactDOM.render(element, this.$pageContainer.get(0));
    }
}
