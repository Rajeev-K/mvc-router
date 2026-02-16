import * as React from "react";
import { Account } from "../Models/Account";

export interface AccountPageProps {
    ref?: React.Ref<AccountPage>;
    account: Account;
    onWithdrawClicked: () => void;
    onDepositClicked: () => void;
}

interface AccountPageState {
}

export class AccountPage extends React.Component<AccountPageProps, AccountPageState> {
    render() {
        return (
            <div>
                <h2>{this.props.account.getName()}</h2>
                <div>Your balance is {this.props.account.getBalance()}</div>
                <br />
                <div className="button-bar">
                    <button type="button" className="withdraw-button" onClick={this.props.onWithdrawClicked}>Withdraw</button>
                    <button type="button" className="deposit-button" onClick={this.props.onDepositClicked}>Deposit</button>
                </div>
            </div>
        );
    }
}
