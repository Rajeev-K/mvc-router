import * as React from "react";
import * as ReactDOM from "react-dom";
import { KeyCodes } from "../Controls/KeyCodes";
import * as DOMUtils from "../Utils/DOMUtils";

/** Base class for modal dialogs. */
export class DialogBase {
    protected el: HTMLDivElement;
    private mask: HTMLElement;
    private okButton: HTMLButtonElement;
    private cancelButton: HTMLButtonElement;
    private closeButton: HTMLButtonElement;
    private reject: () => void;
    private resolve: (value?: any) => void;

    constructor() {
        this.mask = document.createElement("div");
        this.mask.classList.add("dialog-mask");
        document.body.appendChild(this.mask);

        this.el = document.createElement("div");
        this.el.classList.add("dialog");
        this.mask.appendChild(this.el);
    }

    /**
     *  Render the contents of the dialog. Subclasses should override this method.
     *  Note: After the dialog elements have been added to the DOM you must call the init() method.
     */
    protected render(): void {
    }

    protected init(): void {
        this.okButton = this.el.querySelector(".ok-button");
        this.cancelButton = this.el.querySelector(".cancel-button");
        this.closeButton = this.el.querySelector(".close-button");
        this.centerDialog();
        this.attachEventHandlers();
        window.setTimeout(() => this.okButton.focus(), 0);
    }

    protected attachEventHandlers(): void {
        if (this.okButton) {
            this.okButton.addEventListener("click", () => this.onOK());
        }
        if (this.cancelButton) {
            this.cancelButton.addEventListener("click", () => this.onCancel());
        }
        if (this.closeButton) {
            this.closeButton.addEventListener("click", () => this.onCancel());
        }
        this.el.addEventListener("keydown", ev => this.onKeyDown(ev));
    }

    protected onKeyDown(ev: KeyboardEvent): void {
        switch (ev.keyCode) {
            case KeyCodes.Enter:
                this.onEnterKeyPressed();
                ev.preventDefault();
                break;
            case KeyCodes.Escape:
                if (DOMUtils.isVisible(this.cancelButton)) {
                    this.onEscapeKeyPressed();
                }
                ev.preventDefault();
                break;
        }
    }

    /** Handles enter key. May be overridden to change default behavior. */
    protected onEnterKeyPressed(): void {
        this.onOK();
    }

    /** Handles escape key. May be overridden to change default behavior. */
    protected onEscapeKeyPressed(): void {
        this.onCancel();
    }

    private centerDialog(): void {
        let t = (window.innerHeight - this.el.offsetHeight) / 3;
        let l = (window.innerWidth - this.el.offsetWidth) / 2;
        t = Math.max(0, t);
        l = Math.max(0, l);
        this.el.style.top = t + 'px';
        this.el.style.left = l + 'px';
    }

    public showDialog(): Promise<any> {
        this.render();
        return new Promise((resolve, reject) => {
            this.resolve = resolve;
            this.reject = reject;
        });
    }

    private closeDialog(): void {
        this.el.remove();
        this.mask.remove();
    }

    protected onCancel(): void {
        this.closeDialog();
        this.reject();
    }

    /** Handles OK button. Override this method and get user input, then call this base class method. */
    protected onOK(): void {
        this.closeDialog();
        this.resolve();
    }
}
