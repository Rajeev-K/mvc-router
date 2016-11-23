export interface ChangePasswordPanelProps {
}

export interface ChangePasswordPanelState {
}

export class ChangePasswordPanel extends React.Component<ChangePasswordPanelProps, ChangePasswordPanelState> {
    render() {
        return (
            <div className="change-password">
                <div>
                    <div><input type="password" className="old-password-input" placeholder="Old password" /></div>
                    <div><input type="password" className="new-password-input" placeholder="New password" /></div>
                    <div><input type="password" className="retype-password-input" placeholder="Retype new password" /></div>
                </div>
                <div className="button-panel">
                    <button type="submit" className="ok-button default-button">OK</button>
                    <button type="button" className="cancel-button">Cancel</button>
                </div>
            </div>
        );
    }
}
