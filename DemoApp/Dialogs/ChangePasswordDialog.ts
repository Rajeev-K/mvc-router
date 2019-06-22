import { DialogBase } from "./DialogBase";
import { ChangePasswordPanel } from "../Views/ChangePassword";

// How to use dialogs:
//    var dialog = SomeDialog();
//    dialog.field1 = "foo";
//    dialog.field2 = "bar";
//    dialog.showDialog().done(() => {
//       // User pressed OK.
//       // Here dialog.field1 and dialog.field2 will have new values entered by the user.
//    });

export class ChangePasswordDialog extends DialogBase {
    // public members
    public oldPassword = "";
    public newPassword = "";

    constructor() {
        super();
    }

    protected render(): void {
        const element = React.createElement(ChangePasswordPanel, {});
        ReactDOM.render(element, this.el, () => {
            this.init();
        });
    }

    public onOK(): void {
        // Get new values from dialog controls.
        this.oldPassword = (this.el.querySelector('.old-password-input') as HTMLInputElement).value;
        this.newPassword = (this.el.querySelector('.new-password-input') as HTMLInputElement).value;

        super.onOK();
    }
}
