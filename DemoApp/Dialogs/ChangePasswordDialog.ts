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
        var element = React.createElement(ChangePasswordPanel, {});
        ReactDOM.render(element, this.$el.get(0), () => {
            this.init();
        });
    }

    protected init(): void {
        // Call base class method to complete initialization.
        super.init();
    }

    public onOK(): void {
        // Get new values from dialog controls.
        this.oldPassword = this.$el.find('.old-password-input').val();
        this.newPassword = this.$el.find('.new-password-input').val();

        super.onOK();
    }
}
