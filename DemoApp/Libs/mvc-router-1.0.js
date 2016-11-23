var __extends = (this && this.__extends) || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
};
/*! repo location: https://github.com/Rajeev-K/mvc-router */
var MvcRouter;
(function (MvcRouter) {
    /**
     * Each URL path in your app will have a corresponding controller, which should be a subclass of this class.
     * The controller is responsible for rendering the entire page and handling user input as well as UI events.
     * A new instance of the controller is created each time the user navigates to the path.
     * Data that must live longer than the page should be stored in your App subclass.
     *
     * You can have a hierarchy of controllers, with parts that are common to all pages rendered by the base controller.
     */
    var Controller = (function () {
        function Controller() {
            this.loaded = false;
        }
        /**
         * Renders the page, and sets up event handlers.
         * Note that since the user can press the refresh button of the browser, the controller is
         * responsible for rendering the entire page, not just the portions that have changed.
         * In your override of the load method you can start by clearing the current page contents:
         *    $(this.app.getAppBody()).empty().off();
         */
        Controller.prototype.load = function (params) {
            this.loaded = true;
        };
        /**
         * Check if this controller is still loaded.
         * When an ajax call returns, update the UI only if this method returns true.
         */
        Controller.prototype.isLoaded = function () {
            return this.loaded;
        };
        /**
         * Whether the controller is unloadable is returned through a callback.
         * This gives the controller the opportunity to display a "Discard changes?" confirmation dialog.
         */
        Controller.prototype.isUnloadable = function (callback) {
            // This method is meant to be overridden.
            callback(true);
        };
        /**
         * Performs any cleanup or finalization that must be performed before the page is torn down.
         */
        Controller.prototype.unload = function () {
            this.loaded = false;
        };
        return Controller;
    }());
    MvcRouter.Controller = Controller;
    var PageNotFoundController = (function (_super) {
        __extends(PageNotFoundController, _super);
        function PageNotFoundController() {
            _super.apply(this, arguments);
        }
        PageNotFoundController.prototype.load = function (params) {
            MvcRouter.App.getInstance().getAppBody().innerHTML = '<div class="page-not-found">Page not found</div>';
        };
        return PageNotFoundController;
    }(Controller));
    MvcRouter.PageNotFoundController = PageNotFoundController;
})(MvcRouter || (MvcRouter = {}));
/// <reference path="Controller.ts" />
var MvcRouter;
(function (MvcRouter) {
    /**
     * The router is responsible for unloading and loading controllers when a page navigation
     * happens inside your app. You must associate paths with controllers when your application starts.
     * Each time the user navigates to a specific path/page a new instance of the controller will be created.
     */
    var Router = (function () {
        function Router(app) {
            var _this = this;
            this.routes = {};
            /** The controller to use if a controller matching the url could not be found. */
            this.pageNotFoundController = MvcRouter.PageNotFoundController;
            this.app = app;
            this.app.getAppBody().addEventListener('click', function (ev) { return _this.clickHandler(ev); });
            window.onpopstate = function (ev) { return _this.onPopState(ev); };
        }
        /** Associates a path with a controller class. The path can have dynamic segments, for example: /customers/:customer_id */
        Router.prototype.addRoute = function (path, controllerClass) {
            this.routes[path] = controllerClass;
        };
        /**
         * Sets a custom resolver that examines the path and the query parameters and returns
         * a controller class and query parameters to pass to the controller.
         */
        Router.prototype.setCustomResolver = function (resolver) {
            this.resolver = resolver;
        };
        /** Sets the default controller, to be used if a controller matching the url could not be found. */
        Router.prototype.setPageNotFoundController = function (controllerClass) {
            this.pageNotFoundController = controllerClass;
        };
        /**
         * Returns the controller corresponding to the path, and parameters that are embedded in the path (aka dynamic segments).
         * @param path The path portion of the URL. Example: /customers/123 will match the route /customers/:customer_id
         */
        Router.prototype.resolvePath = function (path) {
            if (!path) {
                return { controllerClass: null, queryParams: null };
            }
            var queryParms = {};
            var pathSegments = path.split('/');
            for (var route in this.routes) {
                var routeSegments = route.split('/');
                if (pathSegments.length === routeSegments.length) {
                    var i = void 0;
                    for (i = 0; i < routeSegments.length; i++) {
                        if (routeSegments[i][0] === ':') {
                            var name_1 = routeSegments[i].substring(1);
                            queryParms[name_1] = pathSegments[i];
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
        };
        /** Loads the controller corresponding to the browser's current location. */
        Router.prototype.loadController = function () {
            var _this = this;
            var result = this.parseLocation();
            var _a = this.resolvePath(result.path), controllerClass = _a.controllerClass, queryParams = _a.queryParams;
            queryParams = MvcRouter.Utils.extend({}, result.query, queryParams);
            if (!controllerClass && this.resolver && result.path) {
                var resolverResult = this.resolver(result.path, queryParams);
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
                this.currentController.isUnloadable(function (unloadable) {
                    if (unloadable)
                        _this.loadNewController(controllerClass, queryParams);
                    else
                        _this.restoreLocation();
                });
            }
            else {
                this.loadNewController(controllerClass, queryParams);
            }
        };
        /** Loads the supplied controller and sets it as the current controller. */
        Router.prototype.loadNewController = function (controllerClass, query) {
            if (this.currentController)
                this.currentController.unload();
            this.currentUrl = window.location.href;
            this.currentController = new controllerClass(this.app);
            this.currentController.load(query);
        };
        /** Restores location to its previous value. */
        Router.prototype.restoreLocation = function () {
            if (window.location.href != this.currentUrl)
                window.history.pushState({}, null, this.currentUrl);
        };
        /**
         * Replaces query parameters in the browser's location without reloading the page.
         * @param query new query parameters
         * @param newHistoryEntry if true creates a new history entry instead of modifying the current one. Only works when useHistory option is set.
         */
        Router.prototype.replaceQueryParameters = function (query, newHistoryEntry) {
            var result = this.parseLocation();
            for (var parameter in query) {
                if (query.hasOwnProperty(parameter)) {
                    result.query[parameter] = query[parameter];
                }
            }
            var url = result.path + '?' + this.constructQueryString(result.query);
            if (newHistoryEntry)
                history.pushState({}, null, this.app.getAppPath() + url);
            else
                history.replaceState({}, null, this.app.getAppPath() + url);
        };
        /** Constructs the query string from the supplied name value pairs. */
        Router.prototype.constructQueryString = function (query) {
            var q = [];
            for (var key in query) {
                var value = query[key];
                q.push(key + '=' + encodeURIComponent(value));
            }
            return q.join('&');
        };
        /** Parses the query string. */
        Router.prototype.parseQuery = function (q) {
            var query = {};
            var pairs = q.split('&');
            for (var i = 0; i < pairs.length; i++) {
                var v = pairs[i];
                var pair = v.split('=');
                if (pair.length > 0) {
                    var name_2 = void 0, value = void 0;
                    name_2 = pair[0];
                    if (pair.length > 1)
                        value = pair[1];
                    else
                        value = '';
                    query[name_2] = decodeURIComponent(value);
                }
            }
            return query;
        };
        /** Gets the path and query parameters of the current page. */
        Router.prototype.parseLocation = function () {
            var path = "/";
            var query = {};
            path = this.app.getCurrentPagePath();
            if (window.location.search)
                query = this.parseQuery(window.location.search.substring(1));
            if (path && path.length > 1)
                path = path.replace(/\/$/, ''); // remove trailing '/'
            return { path: path, query: query };
        };
        /** Navigates the app to the new path. */
        Router.prototype.navigate = function (path, query) {
            var q = query ? ('?' + this.constructQueryString(query)) : '';
            history.pushState({}, null, this.app.getAppPath() + path + q);
            this.loadController();
        };
        /** This enables your App subclass to talk to the currently active controller. */
        Router.prototype.getCurrentController = function () {
            return this.currentController;
        };
        /** Handles clicks on all <a class="appnav"></a> elements in app body. */
        Router.prototype.clickHandler = function (ev) {
            // Note that the page may be torn down while we are in this function, so it is important to check for nulls.
            for (var node = ev.target; node; node = node.parentNode) {
                if (node.tagName && node.tagName.toUpperCase() === 'A' && node.classList && node.classList.contains('appnav')) {
                    ev.preventDefault();
                    var href = node.getAttribute('href');
                    if (href) {
                        history.pushState({}, null, this.app.getAppPath() + href);
                        this.loadController();
                        break;
                    }
                }
                if (node === ev.currentTarget)
                    break;
            }
        };
        /** Handles popstate event. */
        Router.prototype.onPopState = function (ev) {
            this.loadController();
        };
        return Router;
    }());
    MvcRouter.Router = Router;
})(MvcRouter || (MvcRouter = {}));
var MvcRouter;
(function (MvcRouter) {
    var Utils;
    (function (Utils) {
        function extend(dest) {
            var src = [];
            for (var _i = 1; _i < arguments.length; _i++) {
                src[_i - 1] = arguments[_i];
            }
            for (var _a = 0, src_1 = src; _a < src_1.length; _a++) {
                var obj = src_1[_a];
                if (obj) {
                    for (var field in obj) {
                        if (obj.hasOwnProperty(field)) {
                            dest[field] = obj[field];
                        }
                    }
                }
            }
            return dest;
        }
        Utils.extend = extend;
    })(Utils = MvcRouter.Utils || (MvcRouter.Utils = {}));
})(MvcRouter || (MvcRouter = {}));
/// <reference path="Router.ts" />
/// <reference path="Controller.ts" />
/// <reference path="Utils.ts" />
var MvcRouter;
(function (MvcRouter) {
    /**
     * This is the root object of the application.
     * Do not use this class directly, make your own subclass instead.
     */
    var App = (function () {
        /**
         * Constructor.
         */
        function App(options) {
            if (App.instance) {
                throw new Error("App instance exists; use getInstance() instead.");
            }
            App.instance = this;
            this.options = MvcRouter.Utils.extend({}, DefaultAppOptions, options);
            if (!this.options.appBody) {
                var el = document.createElement('div');
                document.body.appendChild(el);
                this.options.appBody = el;
            }
            this.router = new MvcRouter.Router(this);
        }
        /** This method must be called after your App subclass is fully initialized. */
        App.prototype.load = function () {
            this.router.loadController();
        };
        App.prototype.getRouter = function () {
            return this.router;
        };
        App.prototype.getAppBody = function () {
            return this.options.appBody;
        };
        App.getInstance = function () {
            return App.instance;
        };
        /**
         * Navigates the app to the page corresponding to the supplied URL.
         * @path path to the page for example "/bank/deposits" will set the location to http://localhost/bank/deposits
         */
        App.prototype.navigate = function (path, queryParams) {
            if (!path || path[0] != '/') {
                throw new Error("Invalid path");
            }
            this.router.navigate(path, queryParams);
        };
        /** Path to the root of the application. Does not end with '/' */
        App.prototype.getAppPath = function () {
            return this.options.appPath;
        };
        /** Gets the path to the currently displayed page. Returned string does not include application path. */
        App.prototype.getCurrentPagePath = function () {
            var fullPath = window.location.pathname;
            var len = this.options.appPath.length;
            if (fullPath.substr(0, len) === this.options.appPath) {
                var pagePath = fullPath.substr(len);
                if (!pagePath.length) {
                    return '/';
                }
                if (pagePath[0] === '/') {
                    return pagePath;
                }
            }
            return null;
        };
        return App;
    }());
    MvcRouter.App = App;
    var DefaultAppOptions = {
        appPath: '',
        appBody: null
    };
})(MvcRouter || (MvcRouter = {}));
var MvcRouter;
(function (MvcRouter) {
    /**
     * Your model objects and your custom controls can implement events to let other parts of the
     * application know that something has happened.
     */
    var Event = (function () {
        function Event() {
            this.listeners = [];
        }
        Event.prototype.trigger = function (sender, eventArgs) {
            this.listeners.forEach(function (listener) { return listener.call(sender, sender, eventArgs); });
        };
        Event.prototype.addListener = function (listener) {
            if (!this.listeners.some(function (l) { return l === listener; })) {
                this.listeners.push(listener);
            }
        };
        Event.prototype.removeListener = function (listener) {
            var index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        };
        return Event;
    }());
    MvcRouter.Event = Event;
    var EventArgs = (function () {
        function EventArgs() {
        }
        EventArgs.Empty = new EventArgs();
        return EventArgs;
    }());
    MvcRouter.EventArgs = EventArgs;
    var PropertyChangedEventArgs = (function (_super) {
        __extends(PropertyChangedEventArgs, _super);
        function PropertyChangedEventArgs() {
            _super.apply(this, arguments);
        }
        return PropertyChangedEventArgs;
    }(EventArgs));
    MvcRouter.PropertyChangedEventArgs = PropertyChangedEventArgs;
})(MvcRouter || (MvcRouter = {}));
