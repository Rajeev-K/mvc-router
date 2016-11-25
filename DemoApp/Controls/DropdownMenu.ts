import { KeyCodes } from "./Keycodes";
import { DropdownMenuPanel } from "../Views/DropdownMenu";

export class DropdownMenu {
    // Events
    public itemSelectedEvent = new MvcRouter.Event<DropdownMenu, MenuItemSelectedEventArgs>();

    // Css classes
    private menuCssClass = "dropdown-menu";
    private menuItemCssClass = "menu-item";
    private highlightCssClass = "highlight";

    // Private members
    private ops: DropdownMenuOptions;

    /**
     * Displays a dropdown menu.
     * @param $el Menu will be shown in this element. When menu is closed this element will be removed from DOM.
     */
    constructor(private $el: JQuery, options?: DropdownMenuOptions) {
        this.ops = $.extend({}, DefaultDropdownMenuOptions, options);
        this.render();
        this.$el.focus();
        this.attachEventHandlers();
    }

    private render(): void {
        this.$el.addClass(this.menuCssClass).attr("tabindex", "0");
        if (this.ops.items && this.ops.items.length) {
            const labels = this.ops.items.map(value => value.toString());
            const element = React.createElement(DropdownMenuPanel, { items: labels });
            ReactDOM.render(element, this.$el.get(0));
        }
    }

    private attachEventHandlers(): void {
        this.$el.on('blur', () => this.close());
        this.$el.on('mouseover', '.' + this.menuItemCssClass, ev => this.onMouseOverItem(ev));
        this.$el.on('mouseout', ev => this.$el.find('.' + this.highlightCssClass).removeClass(this.highlightCssClass));
        this.$el.on('mousedown', ev => this.onItemSelected(this.$el.find('.' + this.highlightCssClass)));
        this.$el.on('keydown', ev => this.onKeyDown(ev));
    }

    private onMouseOverItem(ev: JQueryEventObject): void {
        this.$el.find('.' + this.highlightCssClass).removeClass(this.highlightCssClass);
        $(ev.currentTarget).addClass(this.highlightCssClass);
    }

    private onKeyDown(ev: JQueryEventObject): void {
        switch (ev.which) {
            case KeyCodes.Escape:
                this.close();
                break;
            case KeyCodes.Enter:
                this.onItemSelected(this.$el.find('.' + this.highlightCssClass));
                break;
            case KeyCodes.UpArrow:
            case KeyCodes.DownArrow:
                const $items = this.$el.find('.' + this.menuItemCssClass);
                const $highlighted = this.$el.find('.' + this.highlightCssClass);
                const index = $items.index($highlighted);
                let newIndex;
                if (ev.which === KeyCodes.UpArrow)
                    newIndex = (index === -1 || index === 0) ? $items.length - 1 : index - 1;
                else
                    newIndex = (index === -1 || index === $items.length - 1) ? 0 : index + 1;
                $highlighted.removeClass(this.highlightCssClass);
                $items.eq(newIndex).addClass(this.highlightCssClass);
                break;
        }
        ev.preventDefault();
        ev.stopPropagation();
    }

    private onItemSelected($item: JQuery): void {
        const index = this.$el.find('.' + this.menuItemCssClass).index($item);
        if (index !== -1) {
            this.itemSelectedEvent.trigger(this, { selectedItemIndex: index });
            this.close();
        }
    }

    private close(): void {
        this.$el.remove();
    }
}

export interface DropdownMenuOptions {
    /** Items to display in the menu. Set to null if menu items are already rendered. */
    items?: any[];
}

export const DefaultDropdownMenuOptions: DropdownMenuOptions = {
    items: null
};

export class MenuItemSelectedEventArgs extends MvcRouter.EventArgs {
    public selectedItemIndex: number;
}
