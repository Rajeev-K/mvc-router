import { DialogBase } from "./DialogBase";

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

function ChangePasswordPanel() {
    return (
        <div className="change-password">
            <div>
                <div><input type="password" className="old-password-input" placeholder="Old password" /></div>
                <div><input type="password" className="new-password-input" placeholder="New password" /></div>
                <div><input type="password" className="retype-password-input" placeholder="Retype new password" /></div>
            </div>
            <div className="button-panel">
                <button type="submit" className="ok-button default-button">OK</button>
                <button type="button" className="cancel-button">Cancel</button>
            </div>
        </div>
    );
}
