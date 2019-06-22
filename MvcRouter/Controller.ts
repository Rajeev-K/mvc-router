/*! repo location: https://github.com/Rajeev-K/mvc-router */

namespace MvcRouter {
    /**
     * Each URL path in your app will have a corresponding controller, which should be a subclass of this class.
     * The controller is responsible for rendering the entire page and handling user input as well as UI events.
     * A new instance of the controller is created each time the user navigates to the path.
     * Data that must live longer than the page should be stored in your App subclass.
     * 
     * You can have a hierarchy of controllers, with parts that are common to all pages rendered by the base controller.
     */
    export class Controller {
        private loaded = false;

        /**
         * Renders the page, and sets up event handlers.
         * Note that since the user can press the refresh button of the browser, the controller is 
         * responsible for rendering the entire page, not just the portions that have changed.
         * In your override of the load method you can start by clearing the current page contents:
         *    $(this.app.getAppBody()).empty().off();
         * Your override should call the base class method.
         */
        public load(params: QueryParams): void {
            this.loaded = true;
        }

        /**
         * Check if this controller is still loaded.
         * When an ajax call returns, update the UI only if this method returns true.
         */
        public isLoaded(): boolean {
            return this.loaded;
        }

        /** 
         * Whether the controller is unloadable is returned through a callback.
         * This gives the controller the opportunity to display a "Discard changes?" confirmation dialog.
         */
        public isUnloadable(callback: (unloadable: boolean) => void): void {
            // This method is meant to be overridden.
            callback(true);
        }

        /**
         * Performs any cleanup or finalization that must be performed before the page is torn down.
         */
        public unload(): void {
            this.loaded = false;
        }
    }

    export interface ControllerClass {
        new (app: App): Controller;
    }

    export class PageNotFoundController extends Controller {
        public load(params: QueryParams): void {
            App.getInstance().getAppBody().innerHTML = '<div class="page-not-found">Page not found</div>';
        }
    }
}
