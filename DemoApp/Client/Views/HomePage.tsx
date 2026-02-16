import * as React from "react";
import { Account } from "../Models/Account";

export interface HomePageProps {
    accounts: Account[];
}

interface HomePageState {
}

export class HomePage extends React.Component<HomePageProps, HomePageState> {
    render() {
        const rows = [];
        for (const account of this.props.accounts) {
            rows.push(
                <tr key={account.getAccountType()}>
                    <td><a className="appnav" href={`/account/${account.getAccountType()}`}>{account.getName()}</a></td>
                    <td>{account.getBalance()}</td>
                </tr>
            );
        }
        return (
            <div>
                <h2>Accounts</h2>
                <table className="accounts-table">
                    <thead>
                        <tr>
                            <th>Account Name</th>
                            <th>Balance</th>
                        </tr>
                    </thead>
                    <tbody>{rows}</tbody>
                </table>
            </div>
        );
    }
}
