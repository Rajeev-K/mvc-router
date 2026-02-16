import * as React from "react";

export interface TransactionPageLabels {
    transactionType: string;
    prompt: string;
}

export interface TransactionPageProps extends React.Props<TransactionPage> {
    labels: TransactionPageLabels;
    onOkClicked: () => void;
    onCancelClicked: () => void;
}

interface TransactionPageState {
    accountName?: string;
    balance?: number;
}

export class TransactionPage extends React.Component<TransactionPageProps, TransactionPageState> {
    private amountInput: HTMLInputElement;

    constructor(props) {
        super(props);
        this.state = {
            balance: 0,
            accountName: ''
        };
    }

    public getAmount(): number {
        return parseInt(this.amountInput.value, 10);
    }

    public setBalance(balance: number): void {
        this.setState({ balance });
    }

    public setAccountName(accountName: string): void {
        this.setState({ accountName });
    }

    public render() {
        return (
            <div className="transaction-page">
                <h2>{this.state.accountName} - {this.props.labels.transactionType}</h2>
                <div>Your balance is <span className="balance">{this.state.balance}</span></div>
                <br />
                <div>
                    <div>{this.props.labels.prompt}</div>
                    <div className="input-panel">$ <input type="text" ref={el => this.amountInput = el} className="amount-input" /></div>
                </div>
                <br />
                <div className="button-bar">
                    <button type="button" className="ok-button" onClick={this.props.onOkClicked}>OK</button>
                    <button type="button" className="cancel-button" onClick={this.props.onCancelClicked}>Cancel</button>
                </div>
            </div>
        );
    }
}
