import { BankApp } from "../BankApp";
import { MasterPage } from "../Views/MasterPage";
import { MessageBox } from "../Dialogs/MessageBox";
import { ChangePasswordDialog } from "../Dialogs/ChangePasswordDialog";
import { DropdownMenu } from "../Controls/DropdownMenu";

/**
 * This is the base class for all controllers in this app.
 * Here we render parts common to all pages, and handle events in those parts.
 */
export class ControllerBase extends MvcRouter.Controller {
    protected $pageContainer: JQuery;

    constructor(public app: BankApp) {
        super();
    }

    public load(params: MvcRouter.QueryParams): void {
        super.load(params);
        $(this.app.getAppBody()).off();

        // Render page
        const element = React.createElement(MasterPage, {});
        ReactDOM.render(element, this.app.getAppBody(), () => {
            this.attachMasterPageEventHandlers();
            this.$pageContainer = $(this.app.getAppBody()).find('.page-container');
            this.$pageContainer.off();
            this.loadPage(params);
        });
    }

    private attachMasterPageEventHandlers(): void {
        const $appBody = $(this.app.getAppBody());
        $appBody.on('click', '.services', ev => this.onServicesClicked(ev));
        $appBody.on('click', '.sign-out', () => this.onSignOutClicked());
    }

    /** Loads content page. Subclasses should override. */
    protected loadPage(params: MvcRouter.QueryParams): void {
    }

    private onServicesClicked(ev: JQueryEventObject): void {
        // Add menu to DOM and position it
        const $menu = $("<div></div>").appendTo(this.app.getAppBody());
        const servicesOffset = $(ev.target).offset();
        $menu.css({ left: servicesOffset.left, top: (servicesOffset.top + 32) });

        // Display commands in the menu
        const commands = this.getCommands();
        const menu = new DropdownMenu($menu, { items: commands });
        $menu.get(0).addEventListener('ItemSelected', (e: CustomEvent) => {
            // Execute the selected command
            commands[e.detail.selectedItemIndex].action();
        });
    }

    public onSignOutClicked(): void {
        MessageBox.show("Thank you for clicking the sign out button.");
    }

    public onChangePassword(): void {
        const dialog = new ChangePasswordDialog();
        dialog.showDialog().done(() => {
            MessageBox.show("Your password has been updated.");
        });
    }

    /** Gets commands to be displayed in a menu. */
    public getCommands() {
        return [
            new Command("Pay bills"),
            new Command("Reorder checks"),
            new Command("Change password", () => this.onChangePassword()),
            new Command("Open a new account"),
            new Command("Investments"),
            new Command("Wire transfer"),
            new Command("Statements")
        ];
    }
}

/** Represents a command to be displayed in a menu. Each command has a label and an action method. */
export class Command {
    constructor(public label: string, public action?: () => void) {
        if (!this.action) {
            this.action = () => MessageBox.show("You selected: " + this.label);
        }
    }

    public toString(): string {
        return this.label;
    }
}
