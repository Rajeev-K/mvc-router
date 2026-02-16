import * as React from "react";
import { createRoot, Root } from "react-dom/client";
import { KeyCodes } from "./KeyCodes";
import * as DOMUtils from "../Utils/DOMUtils";

// Css classes
const MenuCssClass = "dropdown-menu";
const MenuItemCssClass = "menu-item";
const HighlightCssClass = "highlight";

export class DropdownMenu {
    // Private members
    private el: HTMLElement;
    private menuRoot: Root;
    private ops: DropdownMenuOptions;

    /**
     * Displays a dropdown menu.
     * @param anchor Menu will be shown below this element, aligned to the left edge of the element.
     * @param items Items to be shown inside the menu. We'll call toString() method on each item.
     * @param options Optional settings.
     * @param callback This method will be called back when a menu item is selected.
     */
    constructor(anchor: HTMLElement, items: any[], options: DropdownMenuOptions,
                private callback: (selectedItemIndex: number) => void) {
        this.ops = { ...DefaultDropdownMenuOptions, ...options };
        this.render(anchor, items);
        this.attachEventHandlers();
        this.el.focus();
    }

    private render(anchor: HTMLElement, items: any[]): void {
        // Add menu to DOM
        this.el = document.createElement("div");
        this.el.classList.add(MenuCssClass);
        this.el.setAttribute("tabindex", "0");
        this.ops.parent.appendChild(this.el);

        // Position it below anchor
        const anchorOffset = DOMUtils.getOffset(anchor);
        const menuTop = anchorOffset.top + anchor.offsetHeight + this.ops.verticalOffset;
        this.el.style.left = anchorOffset.left + 'px';
        this.el.style.top = menuTop + 'px';

        // Add menu items
        if (items && items.length) {
            const labels = items.map(value => value.toString());
            const element = <DropdownMenuPanel items={labels} />;
            this.menuRoot = createRoot(this.el);
            this.menuRoot.render(element);
        }
    }

    private attachEventHandlers(): void {
        this.el.addEventListener('blur', () => this.close());
        this.el.addEventListener('keydown', ev => this.onKeyDown(ev));
        this.el.addEventListener('mouseover', ev => this.onMouseOverItem(ev));
        this.el.addEventListener('mouseout', () => this.onMouseOut());
        this.el.addEventListener('mousedown', () => this.onMouseDown());
    }

    private removeHighlight(): void {
        const current = this.el.querySelector('.' + HighlightCssClass);
        if (current) {
            current.classList.remove(HighlightCssClass);
        }
    }

    private onMouseOverItem(ev: Event): void {
        const target = ev.target as HTMLElement;
        if (target.classList.contains(MenuItemCssClass)) {
            this.removeHighlight();
            target.classList.add(HighlightCssClass);
        }
    }

    private onMouseOut(): void {
        this.removeHighlight();
    }

    private onMouseDown(): void {
        const current = this.el.querySelector('.' + HighlightCssClass);
        this.onItemSelected(current);
    }

    private onKeyDown(ev: KeyboardEvent): void {
        switch (ev.keyCode) {
            case KeyCodes.Escape:
                this.close();
                break;
            case KeyCodes.Enter:
                this.onItemSelected(this.el.querySelector('.' + HighlightCssClass));
                break;
            case KeyCodes.UpArrow:
            case KeyCodes.DownArrow:
                const allItems = Array.from(this.el.querySelectorAll('.' + MenuItemCssClass));
                const current = this.el.querySelector('.' + HighlightCssClass);
                const index = allItems.indexOf(current);
                let newIndex;
                if (ev.keyCode === KeyCodes.UpArrow)
                    newIndex = (index === -1 || index === 0) ? allItems.length - 1 : index - 1;
                else
                    newIndex = (index === -1 || index === allItems.length - 1) ? 0 : index + 1;
                if (current)
                    current.classList.remove(HighlightCssClass);
                allItems[newIndex].classList.add(HighlightCssClass);
                break;
        }
        ev.preventDefault();
        ev.stopPropagation();
    }

    private onItemSelected(item: Element): void {
        if (item) {
            const allItems = Array.from(this.el.querySelectorAll('.' + MenuItemCssClass));
            const index = allItems.indexOf(item);
            if (index !== -1) {
                this.close();
                this.callback(index);
            }
        }
    }

    private close(): void {
        const el = this.el;
        this.el = null;
        if (el) {
            if (this.menuRoot) {
                this.menuRoot.unmount();
                this.menuRoot = null;
            }
            el.remove();
        }
    }
}

export interface DropdownMenuOptions {
    /** How much the menu must be offset relative to the bottom of the anchor element. */
    verticalOffset?: number;
    /** Parent element for the menu; if not specified menu will be added to body. */
    parent?: HTMLElement;
}

export const DefaultDropdownMenuOptions: DropdownMenuOptions = {
    verticalOffset: 0,
    parent: document.body
};

interface DropdownMenuPanelProps {
    items: string[];
}

function DropdownMenuPanel(props: DropdownMenuPanelProps) {
    const items = props.items.map((item, i) => <div key={i} className="menu-item">{item}</div>);
    return (
        <div>{items}</div>
    );
}
