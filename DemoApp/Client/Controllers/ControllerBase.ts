import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import * as MvcRouter from "mvc-router-spa";
import { BankApp } from "../BankApp";
import { MasterPage, MasterPageProps } from "../Views/MasterPage";
import { MessageBox } from "../Dialogs/MessageBox";
import { ChangePasswordDialog } from "../Dialogs/ChangePasswordDialog";
import { DropdownMenu } from "../Controls/DropdownMenu";

/**
 * This is the base class for all controllers in this app.
 * Here we render parts common to all pages, and handle events in those parts.
 */
export class ControllerBase extends MvcRouter.Controller {
    private masterPage: MasterPage;
    protected pageContainer: HTMLElement;
    protected pageRoot: Root;

    constructor(public app: BankApp) {
        super();
    }

    public load(params: MvcRouter.QueryParams): void {
        super.load(params);

        // Render page
        const props: MasterPageProps = {
            onServicesClicked: (ev) => this.onServicesClicked(ev),
            onSignoutClicked: () => this.onSignOutClicked(),
            onMounted: (el) => {
                if (el) {
                    this.pageContainer = el.querySelector('.page-container');
                    this.loadPage(params);
                }
            },
            ref: component => {
                if (component) {
                    this.masterPage = component;
                }
            }
        };
        this.app.getRoot().render(React.createElement(MasterPage, props));
    }

    /** Loads content page. Subclasses should override. */
    protected loadPage(params: MvcRouter.QueryParams): void {
    }

    private onServicesClicked(ev: React.MouseEvent): void {
        const anchor = ev.target as HTMLElement;

        // Display commands in the menu
        const commands = this.getCommands();
        new DropdownMenu(anchor, commands, { verticalOffset: 5, parent: this.app.getAppBody() }, selectedItemIndex => {
            commands[selectedItemIndex].action();
        });
    }

    public onSignOutClicked(): void {
        MessageBox.show("Thank you for clicking the sign out button.");
    }

    public onChangePassword(): void {
        const dialog = new ChangePasswordDialog();
        dialog.showDialog().then(() => {
            MessageBox.show("Your password has been updated.");
        }).catch(() => null);
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

    public unload(): void {
        if (this.pageRoot) {
            this.pageRoot.unmount();
            this.pageRoot = null;
        }
        super.unload();
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
