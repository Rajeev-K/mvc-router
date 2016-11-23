import { Account } from "../Models/Account";

export interface HomePageProps {
    accounts: Account[];
}

export interface HomePageState {
}

export class HomePage extends React.Component<HomePageProps, HomePageState> {
    render() {
        var rows = [];
        for (var i = 0; i < this.props.accounts.length; i++) {
            rows.push(
                <tr key={this.props.accounts[i].getAccountType()}>
                    <td><a className="appnav" href={"/account/" + this.props.accounts[i].getAccountType()}>{this.props.accounts[i].getName()}</a></td>
                    <td>{this.props.accounts[i].getBalance()}</td>
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
