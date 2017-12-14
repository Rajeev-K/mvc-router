/// <reference path="Controller.ts" />

namespace MvcRouter {
    /**
     * The router is responsible for unloading and loading controllers when a page navigation
     * happens inside your app. You must associate paths with controllers when your application starts.
     * Each time the user navigates to a specific path/page a new instance of the controller will be created.
     */
    export class Router {
        private routes: RouteMap = {};
        private resolver: Resolver;
        private app: App;

        /** The currently active controller. */
        private currentController: Controller;

        /** The url corresponding to the current controller. */
        private currentUrl: string;

        /** The controller to use if a controller matching the url could not be found. */
        private pageNotFoundController: ControllerClass = PageNotFoundController;

        constructor(app: App) {
            this.app = app;
            this.app.getAppBody().addEventListener('click', ev => this.clickHandler(ev));
            window.onpopstate = ev => this.onPopState(ev);
        }

        /** Associates a path with a controller class. The path can have dynamic segments, for example: /customers/:customer_id */
        public addRoute(path: string, controllerClass: ControllerClass): void {
            this.routes[path] = controllerClass;
        }

        /** 
         * Sets a custom resolver that examines the path and the query parameters and returns
         * a controller class and query parameters to pass to the controller.
         */
        public setCustomResolver(resolver: Resolver): void {
            this.resolver = resolver;
        }

        /** Sets the default controller, to be used if a controller matching the url could not be found. */
        public setPageNotFoundController(controllerClass: ControllerClass): void {
            this.pageNotFoundController = controllerClass;
        }

        /**
         * Returns the controller corresponding to the path, and parameters that are embedded in the path (aka dynamic segments).
         * @param path The path portion of the URL. Example: /customers/123 will match the route /customers/:customer_id
         */
        private resolvePath(path: string): ResolverResult {
            if (!path) {
                return { controllerClass: null, queryParams: null };
            }
            const queryParms: QueryParams = {};
            const pathSegments = path.split('/');
            for (const route in this.routes) {
                const routeSegments = route.split('/');
                if (pathSegments.length === routeSegments.length) {
                    let i: number;
                    for (i = 0; i < routeSegments.length; i++) {
                        if (routeSegments[i][0] === ':') {
                            const name = routeSegments[i].substring(1);
                            queryParms[name] = pathSegments[i];
                        }
                        else if (routeSegments[i] !== pathSegments[i]) {
                            break;
                        }
                    }
                    if (i === routeSegments.length) {
                        return { controllerClass: this.routes[route], queryParams: queryParms };
                    }
                }
            }
            return { controllerClass: null, queryParams: null };
        }

        /** Loads the controller corresponding to the browser's current location. */
        public loadController(): void {
            const result = this.parseLocation();
            let { controllerClass, queryParams } = this.resolvePath(result.path);
            queryParams = Utils.extend({}, result.query, queryParams);
            if (!controllerClass && this.resolver && result.path) {
                const resolverResult = this.resolver(result.path, queryParams);
                if (resolverResult) {
                    controllerClass = resolverResult.controllerClass;
                    if (resolverResult.queryParams)
                        queryParams = resolverResult.queryParams;
                }
            }
            if (!controllerClass) {
                controllerClass = this.pageNotFoundController;
            }

            if (this.currentController) {
                this.currentController.isUnloadable(unloadable => {
                    if (unloadable)
                        this.loadNewController(controllerClass, queryParams);
                    else
                        this.restoreLocation();
                });
            }
            else {
                this.loadNewController(controllerClass, queryParams);
            }
        }

        /** Loads the supplied controller and sets it as the current controller. */
        private loadNewController(controllerClass: ControllerClass, query: QueryParams): void {
            if (this.currentController)
                this.currentController.unload();
            this.currentUrl = window.location.href;
            this.currentController = new controllerClass(this.app);
            this.currentController.load(query);
        }

        /** Restores location to its previous value. */
        private restoreLocation(): void {
            if (window.location.href != this.currentUrl)
                window.history.pushState({}, null, this.currentUrl);
        }

        /**
         * Replaces query parameters in the browser's location without reloading the page.
         * @param query new query parameters
         * @param newHistoryEntry if true creates a new history entry instead of modifying the current one.
         */
        public replaceQueryParameters(query: QueryParams, newHistoryEntry?: boolean): void {
            const result = this.parseLocation();
            for (const parameter in query) {
                if (query.hasOwnProperty(parameter)) {
                    result.query[parameter] = query[parameter];
                }
            }
            const url = result.path + '?' + this.constructQueryString(result.query);
            if (newHistoryEntry)
                history.pushState({}, null, this.app.getAppPath() + url);
            else
                history.replaceState({}, null, this.app.getAppPath() + url);
        }

        /**
         * Sets the fragment portion of the current URL, without reloading the page.
         * @param fragment New fragment, which must start with a '#' character.
         */
        public setHash(hash: string): void {
            if (hash && hash[0] === '#')
                window.history.replaceState({}, null, hash);
        }

        public getHash(): string {
            return window.location.hash;
        }

        /** Constructs the query string from the supplied name value pairs. */
        private constructQueryString(query: QueryParams): string {
            const q = [];
            for (const key in query) {
                const value = query[key];
                q.push(key + '=' + encodeURIComponent(value));
            }
            return q.join('&');
        }

        /** Parses the query string. */
        private parseQuery(q: string): QueryParams {
            const query: QueryParams = {};
            const pairs = q.split('&');
            for (let i = 0; i < pairs.length; i++) {
                const v = pairs[i];
                const pair = v.split('=');
                if (pair.length > 0) {
                    let name: string, value: string;
                    name = pair[0];
                    if (pair.length > 1)
                        value = pair[1];
                    else
                        value = '';
                    query[name] = decodeURIComponent(value);
                }
            }
            return query;
        }

        /** Gets the path and query parameters of the current page. */
        public parseLocation(): { path: string; query: QueryParams; } {
            let path = "/";
            let query: QueryParams = {};
            path = this.app.getCurrentPagePath();
            if (window.location.search)
                query = this.parseQuery(window.location.search.substring(1));
            if (path && path.length > 1)
                path = path.replace(/\/$/, '');   // remove trailing '/'
            return { path: path, query: query };
        }

        /** Navigates the app to the new path. */
        public navigate(path: string, query?: QueryParams) {
            const q = query ? ('?' + this.constructQueryString(query)) : '';
            history.pushState({}, null, this.app.getAppPath() + path + q);
            this.loadController();
        }

        /** This enables your App subclass to talk to the currently active controller. */
        public getCurrentController(): Controller {
            return this.currentController;
        }

        /** Handles clicks on all <a class="appnav"></a> elements in app body. */
        private clickHandler(ev: MouseEvent): void {
            // Note that the page may be torn down while we are in this function, so it is important to check for nulls.
            for (let node = <Element>ev.target; node; node = <Element>node.parentNode) {
                if (node.tagName && node.tagName.toUpperCase() === 'A' && node.classList && node.classList.contains('appnav')) {
                    ev.preventDefault();
                    const href = node.getAttribute('href');
                    if (href) {
                        history.pushState({}, null, this.app.getAppPath() + href);
                        this.loadController();
                        break;
                    }
                }
                if (node === ev.currentTarget)
                    break;
            }
        }

        /** Handles popstate event. */
        private onPopState(ev: PopStateEvent): void {
            this.loadController();
        }
    }

    interface RouteMap {
        [index: string]: ControllerClass;
    }

    export interface QueryParams {
        [index: string]: string;
    }

    /** Custom resolver function. */
    export type Resolver = (path: string, params: QueryParams) => ResolverResult;

    /** The return type of custom resolver. */
    export interface ResolverResult {
        /** The controller class corresponding to the url */
        controllerClass: ControllerClass;
        /** Replacement query parameters to be passed to the controller. If not specified, original query parameters will be passed unchanged. */
        queryParams?: QueryParams;
    }
}
