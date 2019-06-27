# MVC Router
A JavaScript library for building Single Page Applications (SPA) using the Model-View-Controller (MVC) design pattern.

## Install

To add MVC Router to your application:

```
npm install mvc-router-spa --save
```

## Why MVC?
MVC is a proven technology that has withstood the test of time. Applications built using this pattern tend to be simpler and more maintainable.

MVC is a common and familiar pattern used by many frameworks, for building Web as well as native apps. If you are an iOS developer you may already be familiar with [MVC in Cocoa](https://developer.apple.com/library/archive/documentation/General/Conceptual/CocoaEncyclopedia/Model-View-Controller/Model-View-Controller.html). Most UI frameworks, including ASP.NET Core, JSP and JSF (Java based frameworks), Ruby on Rails, and Django (Python) are all based on MVC. That's no accident. These disparate platforms &mdash; mobile and Web &mdash; all converged on MVC because it is the best architectural pattern for developing user interfaces.

## Parts of an MVC application
A typical MVC application has the following parts:
- The Application object holds application state and sets up routes.
- Model objects encapsulate application data.
- View objects display application data.
- Controller objects handle data retrieval and persistence, mediates between model and view layers, and handles control flow.

## Application Object
The application object is a singleton object that inherits from `MvcRouter.App` and holds the application state. When your site loads, the constructor of your Application object executes before anything else. 

### Setting up routes
The Application object sets up the routes of the application by mapping URL paths to Controller classes, then calls the `load` method of the base class:

```typescript
class MyApp extends MvcRouter.App {
    constructor() {
        super();

        const router = this.getRouter();
        router.addRoute("/", HomeController);
        router.addRoute("/product", ProductController);
        router.addRoute("/account", AccountController);

        this.load();
    }
}
```
Note that the second parameter to the `addRoute()` method is not an instance of a controller, but the controller class. 

Instead of mapping each path separately you can also supply your own path-to-controller resolver by calling `router.setCustomResolver()`.

### Query and path parameters
If the URL contains query parameters it will be made available to your controller. No additional setup is necessary to receive query parameters. 

You can also pass values as part of the URL path. So for example, instead of /product?id=123 the URL can be in the form /product/123. In this case the route must be defined as follows:
```typescript
        router.addRoute("/product/:id", ProductController);
```
Note that the parameter name is prefixed with a colon. 

In either case the parameter name and values are made available to the controller in the same way, so your controller need not know whether the value was passed on the path or as a query parameter.

## Model Objects
Model objects hold the data of your application. Objects in this layer are kept independent of the other layers.

MVC Router does not care what your model objects look like. However your choice of View technology may dictate the type and structure of your model objects. Most View technologies, such as React.js, allow you to use Plain Old JavaScript Objects (POJO) in your model layer.

## View Objects
The View layer is only concerned with presentation.

MVC Router is independent of the technology used to implement your View layer. You could use React.js or Handlebars templates, for example.

## Controller Objects
Controllers fetch data to be displayed, making ajax calls if necessary, render the appropriate View objects, and set up event handlers in order to handle user actions. In the course of handling user actions, controllers may cause the application to navigate to other pages. Controllers also handle modifying and persisting application state, making ajax calls if necessary.

Controller objects inherit from `MvcRouter.Controller`. Each URL path in your app will have a corresponding controller. MVC Router creates a new instance of the controller class each time a path is loaded. Because of this, data that must live longer than the page must be stored in your Application object, not in the controller.

In the simple example below, the controller renders the page using jQuery. (You may want to use more modern libraries such as React.js instead, to implement the View layer.)

```typescript
class ProductController extends MvcRouter.Controller {
    constructor(private app: MyApp) {
        super();
    }    

    public load(params: MvcRouter.QueryParams) {
        super.load(params);
        const productPageTemplate = $("#product-page-template").html();
        $(this.app.getAppBody()).empty().html(productPageTemplate);
    }
}
```

You can have a hierarchy of controllers, with parts that are common to all pages rendered by the base controller.

### Navigating from page to page
Your application navigates from one page to the next in one of two ways:
- The user clicks on a link. Links to other parts of the application must have the "appnav" class, like this:
`<a href="/products" class="appnav">Products</a>`
If `appnav` is specified then MVC Router will use HTML5 pushState API to perform the navigation. If the `appnav` class is not specified then clicking on the link will cause the entire site to reload. 

- You can also programmatically navigate to another page by calling `this.app.navigate('/new/path')` in your controller. Internally, MVC Router uses HTML5 pushState API to perform the navigation.

## Comparison to React Router
React Router is a popular router specifically designer for React. It is very easy to set up routes and nested components in React Router. But that's where the ease-of-use ends. Setting up pages that need authentication is hard. Nested components have no easy way to communicate with each other. If a nested component wants to listen to an event sent by an element in an outer component there is no easy way to do that. Calling a method implemented by an outer component is hard. In MVC all these things are incredibly easy because you have a controller hierarchy that matches the view nesting. Want to hide an element dislayed in the master page? Just call a base class method. Want to be notified when a button in the master page is clicked? Just override a base class method!

## Demo App
Included demo application uses React.js in the View layer, and has a master page that includes a top bar and left panel, dropdown menu, dialogs and other goodies.

![Demo App](/images/screenshot.png?raw=true "Screenshot")
