import { Account } from "../Models/Account";

export interface AccountPageProps extends React.Props<AccountPage> {
    account: Account;
    onWithdrawClicked: () => void;
    onDepositClicked: () => void;
}

export interface AccountPageState {
}

export class AccountPage extends React.Component<AccountPageProps, AccountPageState> {
    render() {
        return (
            <div>
                <h2>{this.props.account.getName()}</h2>
                <div>Your balance is {this.props.account.getBalance()}</div>
                <br />
                <div className="button-bar">
                    <button type="button" className="widthdraw-button" onClick={this.props.onWithdrawClicked}>Withdraw</button>
                    <button type="button" className="deposit-button" onClick={this.props.onDepositClicked}>Deposit</button>
                </div>
            </div>
        );
    }
}
