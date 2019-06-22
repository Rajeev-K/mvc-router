/// <reference path="Router.ts" />
/// <reference path="Controller.ts" />

namespace MvcRouter {
    /**
     * This is the root object of the application.
     * Do not use this class directly, make your own subclass instead.
     */
    export class App {
        private static instance: App;
        private router: Router;
        private options: AppSettings;

        /**
         * Constructor.
         */
        constructor(options?: AppSettings) {
            if (App.instance) {
                throw new Error("App instance exists; use getInstance() instead.");
            }
            App.instance = this;
            this.options = { ...DefaultAppSettings, ...options };
            if (!this.options.appBody) {
                const el = document.createElement('div');
                document.body.appendChild(el);
                this.options.appBody = el;
            }
            this.router = new Router(this);
        }

        /** This method must be called after your App subclass is fully initialized. */
        public load(): void {
            this.router.loadController();
        }

        public getRouter(): Router {
            return this.router;
        }

        public getAppBody(): HTMLElement {
            return this.options.appBody;
        }

        public static getInstance(): App {
            return App.instance;
        }

        /** 
         * Navigates the app to the page corresponding to the supplied URL.
         * @path path to the page for example "/bank/deposits" will set the location to http://localhost/bank/deposits
         */
        public navigate(path: string, queryParams?: QueryParams): void {
            if (!path || path[0] !== '/') {
                throw new Error("Invalid path");
            }
            this.router.navigate(path, queryParams);
        }

        /** Path to the root of the application. Does not end with '/' */
        public getAppPath(): string {
            return this.options.appPath;
        }

        /** Gets the path to the currently displayed page. Returned string does not include application path. */
        public getCurrentPagePath(): string {
            const fullPath = window.location.pathname;
            const len = this.options.appPath.length;
            if (fullPath.substr(0, len) === this.options.appPath) {
                const pagePath = fullPath.substr(len);
                if (!pagePath) {
                    return '/';
                }
                if (pagePath[0] === '/') {
                    return pagePath;
                }
            }
            return null;
        }
    }

    export interface AppSettings {
        /** Path to the root of the application. Should NOT end with a '/'. Example: /myapp */
        appPath?: string;
        /** The element which will serve as the root element of the application. */
        appBody?: HTMLElement;
    }

    const DefaultAppSettings: AppSettings = {
        appPath: '',
        appBody: null
    };
}
