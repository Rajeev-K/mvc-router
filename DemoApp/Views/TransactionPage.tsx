export interface TransactionPageLabels {
    transactionType: string;
    prompt: string;
}

export interface TransactionPageProps {
    accountName: string;
    labels: TransactionPageLabels;
}

export interface TransactionPageState {
    balance: number;
}

export class TransactionPage extends React.Component<TransactionPageProps, TransactionPageState> {
    constructor(props) {
        super(props);
        this.state = {
            balance: 0
        };
    }

    render() {
        return (
            <div className="transaction-page">
                <h2>{this.props.accountName} - {this.props.labels.transactionType}</h2>
                <div>Your balance is <span className="balance">{this.state.balance}</span></div>
                <br />
                <div>
                    <div>{this.props.labels.prompt}</div>
                    <div className="input-panel">$ <input type="text" className="amount-input" /></div>
                </div>
                <br />
                <div className="button-bar">
                    <button type="button" className="ok-button">OK</button>
                    <button type="button" className="cancel-button">Cancel</button>
                </div>
            </div>
        );
    }
}
