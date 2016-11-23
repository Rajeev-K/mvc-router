export interface DropdownMenuPanelProps {
    items: string[];
}

export interface DropdownMenuPanelState {
}

export class DropdownMenuPanel extends React.Component<DropdownMenuPanelProps, DropdownMenuPanelState> {
    render() {
        const items = this.props.items.map((item, i) => <div key={i} className="menu-item">{item}</div>);
        return (
            <div>{items}</div>
        );
    }
}
