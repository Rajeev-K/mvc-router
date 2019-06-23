import * as React from "react";
import * as ReactDOM from "react-dom";

export interface SupportPageProps extends React.Props<SupportPage> {
    onSendButtonClicked: () => void;
}

export interface SupportPageState {
    message?: string;
}

export class SupportPage extends React.Component<SupportPageProps, SupportPageState> {
    constructor(props: SupportPageProps) {
        super(props);
        this.state = {
            message: ''
        }
    }

    private handleChange = event => {
        this.setState({ message: event.target.value });
    };

    public render() {
        return (
            <div className="support-page">
                <h2>Support</h2>
                <div>Send us a message:</div>
                <textarea rows={12} cols={80} value={this.state.message} onChange={this.handleChange}></textarea>
                <div>
                    <button type="button" className="send-button" onClick={this.props.onSendButtonClicked}>Send</button>
                </div>
            </div>
        );
    }
}
