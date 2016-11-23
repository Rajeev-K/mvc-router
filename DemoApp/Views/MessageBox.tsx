export interface MessageBoxPanelProps {
    message: string;
    hideCancelButton: boolean;
    okButtonLabel: string;
    cancelButtonLabel: string;
}

export interface MessageBoxPanelState {
}

export class MessageBoxPanel extends React.Component<MessageBoxPanelProps, MessageBoxPanelState> {
    render() {
        var cancelButton = this.props.hideCancelButton ?
            null : <button type="button" className="cancel-button">{this.props.cancelButtonLabel}</button>
        return (
            <div className="message-box">
                <div className="message-box-message">{this.props.message}</div>
                <div className="button-panel">
                    <button type="button" className="ok-button default-button">{this.props.okButtonLabel}</button>
                    {cancelButton}
                </div>
            </div>
        );
    }
}
