import { KeyCodes } from "../Controls/KeyCodes";

/** Base class for modal dialogs. */
export class DialogBase {
    protected $el: JQuery;
    private $mask: JQuery;
    private dfd = $.Deferred();
    private $okButton: JQuery;
    private $cancelButton: JQuery;
    private $closeButton: JQuery;

    constructor() {
        this.$mask = $('<div class="dialog-mask"></div>').appendTo(document.body);
        this.$el = $('<div class="dialog"></div>').appendTo(this.$mask);
    }

    /**
     *  Render the contents of the dialog.
     *  Note: After the dialog elements have been added to the DOM you must call the init() method.
     */
    protected render(): void {
    }

    protected init(): void {
        this.$okButton = this.$el.find(".ok-button");
        this.$cancelButton = this.$el.find(".cancel-button");
        this.$closeButton = this.$el.find(".close-button");
        this.centerDialog();
        this.handleEvents();
        window.setTimeout(() => this.$okButton.focus(), 0);
    }

    protected handleEvents(): void {
        this.$okButton.click(() => this.onOK());
        this.$cancelButton.click(() => this.onCancel());
        this.$closeButton.click(() => this.onCancel());
        this.$el.keydown(ev => this.onKeyDown(ev));
    }

    protected onKeyDown(ev: JQueryKeyEventObject): void {
        switch (ev.which) {
            case KeyCodes.Enter:
                this.onEnterKeyPressed();
                ev.preventDefault();
                break;
            case KeyCodes.Escape:
                if (this.$cancelButton.is(":visible")) {
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
        var t = ($(window).height() - this.$el.height()) / 3;
        var l = ($(window).width() - this.$el.width()) / 2;
        t = Math.max(0, t);
        l = Math.max(0, l);
        this.$el.css({ top: t + 'px', left: l + 'px' });
    }

    public showDialog(): JQueryPromise<any> {
        this.render();
        return this.dfd.promise();
    }

    private closeDialog(): void {
        this.$el.remove();
        this.$mask.remove();
    }

    protected onCancel(): void {
        this.closeDialog();
        this.dfd.reject();
    }

    /** Handles OK button. Override this method and get user input, then call this base class method. */
    protected onOK(): void {
        this.closeDialog();
        this.dfd.resolve();
    }
}
