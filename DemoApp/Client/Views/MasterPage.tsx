import * as React from "react";

export interface MasterPageProps {
    ref?: React.Ref<MasterPage>;
    onServicesClicked: (ev: React.MouseEvent) => void;
    onSignoutClicked: () => void;
    onMounted?: (el: HTMLDivElement) => void;
}

interface MasterPageState {
}

export class MasterPage extends React.Component<MasterPageProps, MasterPageState> {
    render() {
        return (
            <div className="page" ref={this.props.onMounted}>
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

export function createMasterPage(props: MasterPageProps): React.ReactNode {
    return <MasterPage {...props} />;
}
