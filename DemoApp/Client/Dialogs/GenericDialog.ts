import * as React from "react";
import { DialogBase } from "./DialogBase";

/**
 * A reusable dialog that can display any React component without needing to subclass DialogBase.
 * Pass a component class and its props, and GenericDialog handles the rest.
 */
export class GenericDialog<P> extends DialogBase {
    private options: GenericDialogOptions;

    constructor(private componentClass: React.ComponentType<P>, private props: P, options?: GenericDialogOptions) {
        super();
        this.options = { ...DefaultGenericDialogOptions, ...options };
        if (this.options.dialogClass) {
            this.el.classList.add(this.options.dialogClass);
        }
    }

    protected render(): void {
        this.renderContent(React.createElement(this.componentClass, this.props));
    }
}

export interface GenericDialogOptions {
    dialogClass?: string;
}

const DefaultGenericDialogOptions: GenericDialogOptions = {
};
