export interface SupportPageProps {
}

export interface SupportPageState {
}

export class SupportPage extends React.Component<SupportPageProps, SupportPageState> {
    render() {
        return (
            <div className="support-page">
                <h2>Support</h2>
                <div>Send us a message:</div>
                <textarea rows={12} cols={80}></textarea>
                <div>
                    <button type="button" className="send-button">Send</button>
                </div>
            </div>
        );
    }
}
