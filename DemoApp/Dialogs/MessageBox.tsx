import { DialogBase } from "./DialogBase";

export class MessageBox extends DialogBase {
    public message: string;
    private options: MessageBoxOptions;

    constructor(options: MessageBoxOptions) {
        super();
        this.options = { ...DefaultMessageBoxOptions, ...options };
    }

    protected render(): void {
        const props: MessageBoxPanelProps = {
            okButtonLabel: this.options.okButtonLabel,
            cancelButtonLabel: this.options.cancelButtonLabel,
            hideCancelButton: this.options.hideCancelButton,
            message: this.message
        };
        const element = React.createElement(MessageBoxPanel, props);
        ReactDOM.render(element, this.el, () => {
            this.init();
        });
    }

    protected init(): void {
        // Call base class method to complete initialization.
        super.init();
    }

    /** Static method for displaying a simple message. */
    public static show(message: string): Promise<any> {
        const mb = new MessageBox({ hideCancelButton: true });
        mb.message = message;
        return mb.showDialog();
    }

    /** Static method for asking the user a yes/no question. OK/Cancel buttons are relabeled to Yes/No. */
    public static ask(title: string, message: string): Promise<any> {
        const mb = new MessageBox({ okButtonLabel: "Yes", cancelButtonLabel: "No" });
        mb.message = message;
        return mb.showDialog();
    }
}

export interface MessageBoxOptions {
    hideCancelButton?: boolean;
    okButtonLabel?: string;
    cancelButtonLabel?: string;
}

const DefaultMessageBoxOptions: MessageBoxOptions = {
    hideCancelButton: false,
    okButtonLabel: 'OK',
    cancelButtonLabel: 'Cancel'
};

interface MessageBoxPanelProps {
    message: string;
    hideCancelButton: boolean;
    okButtonLabel: string;
    cancelButtonLabel: string;
}

function MessageBoxPanel(props: MessageBoxPanelProps): JSX.Element {
    const cancelButton = props.hideCancelButton ?
        null : <button type="button" className="cancel-button">{props.cancelButtonLabel}</button>
    return (
        <div className="message-box">
            <div className="message-box-message">{props.message}</div>
            <div className="button-panel">
                <button type="button" className="ok-button default-button">{props.okButtonLabel}</button>
                {cancelButton}
            </div>
        </div>
    );
}
