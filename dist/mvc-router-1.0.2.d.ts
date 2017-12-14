/*! repo location: https://github.com/Rajeev-K/mvc-router */
declare namespace MvcRouter {
    /**
     * Each URL path in your app will have a corresponding controller, which should be a subclass of this class.
     * The controller is responsible for rendering the entire page and handling user input as well as UI events.
     * A new instance of the controller is created each time the user navigates to the path.
     * Data that must live longer than the page should be stored in your App subclass.
     *
     * You can have a hierarchy of controllers, with parts that are common to all pages rendered by the base controller.
     */
    class Controller {
        private loaded;
        /**
         * Renders the page, and sets up event handlers.
         * Note that since the user can press the refresh button of the browser, the controller is
         * responsible for rendering the entire page, not just the portions that have changed.
         * In your override of the load method you can start by clearing the current page contents:
         *    $(this.app.getAppBody()).empty().off();
         */
        load(params: QueryParams): void;
        /**
         * Check if this controller is still loaded.
         * When an ajax call returns, update the UI only if this method returns true.
         */
        isLoaded(): boolean;
        /**
         * Whether the controller is unloadable is returned through a callback.
         * This gives the controller the opportunity to display a "Discard changes?" confirmation dialog.
         */
        isUnloadable(callback: (unloadable: boolean) => void): void;
        /**
         * Performs any cleanup or finalization that must be performed before the page is torn down.
         */
        unload(): void;
    }
    interface ControllerClass {
        new (app: App): Controller;
    }
    class PageNotFoundController extends Controller {
        load(params: QueryParams): void;
    }
}
declare namespace MvcRouter {
    /**
     * The router is responsible for unloading and loading controllers when a page navigation
     * happens inside your app. You must associate paths with controllers when your application starts.
     * Each time the user navigates to a specific path/page a new instance of the controller will be created.
     */
    class Router {
        private routes;
        private resolver;
        private app;
        /** The currently active controller. */
        private currentController;
        /** The url corresponding to the current controller. */
        private currentUrl;
        /** The controller to use if a controller matching the url could not be found. */
        private pageNotFoundController;
        constructor(app: App);
        /** Associates a path with a controller class. The path can have dynamic segments, for example: /customers/:customer_id */
        addRoute(path: string, controllerClass: ControllerClass): void;
        /**
         * Sets a custom resolver that examines the path and the query parameters and returns
         * a controller class and query parameters to pass to the controller.
         */
        setCustomResolver(resolver: Resolver): void;
        /** Sets the default controller, to be used if a controller matching the url could not be found. */
        setPageNotFoundController(controllerClass: ControllerClass): void;
        /**
         * Returns the controller corresponding to the path, and parameters that are embedded in the path (aka dynamic segments).
         * @param path The path portion of the URL. Example: /customers/123 will match the route /customers/:customer_id
         */
        private resolvePath(path);
        /** Loads the controller corresponding to the browser's current location. */
        loadController(): void;
        /** Loads the supplied controller and sets it as the current controller. */
        private loadNewController(controllerClass, query);
        /** Restores location to its previous value. */
        private restoreLocation();
        /**
         * Replaces query parameters in the browser's location without reloading the page.
         * @param query new query parameters
         * @param newHistoryEntry if true creates a new history entry instead of modifying the current one.
         */
        replaceQueryParameters(query: QueryParams, newHistoryEntry?: boolean): void;
        /**
         * Sets the fragment portion of the current URL, without reloading the page.
         * @param fragment New fragment, which must start with a '#' character.
         */
        setHash(hash: string): void;
        getHash(): string;
        /** Constructs the query string from the supplied name value pairs. */
        private constructQueryString(query);
        /** Parses the query string. */
        private parseQuery(q);
        /** Gets the path and query parameters of the current page. */
        parseLocation(): {
            path: string;
            query: QueryParams;
        };
        /** Navigates the app to the new path. */
        navigate(path: string, query?: QueryParams): void;
        /** This enables your App subclass to talk to the currently active controller. */
        getCurrentController(): Controller;
        /** Handles clicks on all <a class="appnav"></a> elements in app body. */
        private clickHandler(ev);
        /** Handles popstate event. */
        private onPopState(ev);
    }
    interface QueryParams {
        [index: string]: string;
    }
    /** Custom resolver function. */
    type Resolver = (path: string, params: QueryParams) => ResolverResult;
    /** The return type of custom resolver. */
    interface ResolverResult {
        /** The controller class corresponding to the url */
        controllerClass: ControllerClass;
        /** Replacement query parameters to be passed to the controller. If not specified, original query parameters will be passed unchanged. */
        queryParams?: QueryParams;
    }
}
declare namespace MvcRouter.Utils {
    function extend(dest: any, ...src: any[]): any;
}
declare namespace MvcRouter {
    /**
     * This is the root object of the application.
     * Do not use this class directly, make your own subclass instead.
     */
    class App {
        private static instance;
        private router;
        private options;
        /**
         * Constructor.
         */
        constructor(options?: AppSettings);
        /** This method must be called after your App subclass is fully initialized. */
        load(): void;
        getRouter(): Router;
        getAppBody(): HTMLElement;
        static getInstance(): App;
        /**
         * Navigates the app to the page corresponding to the supplied URL.
         * @path path to the page for example "/bank/deposits" will set the location to http://localhost/bank/deposits
         */
        navigate(path: string, queryParams?: QueryParams): void;
        /** Path to the root of the application. Does not end with '/' */
        getAppPath(): string;
        /** Gets the path to the currently displayed page. Returned string does not include application path. */
        getCurrentPagePath(): string;
    }
    interface AppSettings {
        /** Path to the root of the application. Should NOT end with a '/'. Example: /myapp */
        appPath?: string;
        /** The element which will serve as the root element of the application. */
        appBody?: HTMLElement;
    }
}
