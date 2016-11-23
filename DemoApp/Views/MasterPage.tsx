export interface MasterPageProps {
}

export interface MasterPageState {
}

export class MasterPage extends React.Component<MasterPageProps, MasterPageState> {
    render() {
        return (
            <div className="page">
                <div className="header">
                    <div className="company-name">Mega Bank</div>
                    <div className="rhs">
                        <div className="goto">Go to</div>
                        <div className="sign-out">Sign out</div>
                    </div>
                </div>
                <div className="leftnav">
                    <div><a className="appnav" href="/">Accounts</a></div>
                    <div><a className="appnav" href="/support">Customer Support</a></div>
                </div>
                <div className="page-container"></div>
            </div>
        );
    }
}
