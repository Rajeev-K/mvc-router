import * as React from "react";
import * as ReactDOM from "react-dom";

export interface MasterPageProps extends React.Props<MasterPage> {
    onServicesClicked: (ev: React.MouseEvent) => void;
    onSignoutClicked: () => void;
}

export interface MasterPageState {
}

export class MasterPage extends React.Component<MasterPageProps, MasterPageState> {
    render() {
        return (
            <div className="page">
                <div className="header">
                    <div className="company-name"><a href="/" className="appnav">Mega Bank</a></div>
                    <div className="rhs">
                        <div className="services" onClick={this.props.onServicesClicked}>Services</div>
                        <div className="sign-out" onClick={this.props.onSignoutClicked}>Sign Out</div>
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
