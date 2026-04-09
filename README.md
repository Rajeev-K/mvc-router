# MVC Router
A JavaScript library for building Single Page Applications (SPA) using the Model-View-Controller (MVC) design pattern.

## Install

To add MVC Router to your application:

```
npm install mvc-router-spa --save
```

## Why MVC?
MVC is a proven technology that has withstood the test of time. Applications built using this pattern tend to be simpler and more maintainable.

MVC is a common and familiar pattern used by many frameworks for building both web and native applications. If you are an iOS developer, you may already be familiar with [MVC in Cocoa](https://developer.apple.com/library/archive/documentation/General/Conceptual/CocoaEncyclopedia/Model-View-Controller/Model-View-Controller.html). Most UI frameworks &mdash; including ASP.NET Core, Spring MVC (often used via Spring Boot), Ruby on Rails, and Django &mdash; are built around MVC or a close variation of it. This is not accidental. Across mobile and web platforms, MVC emerged as a practical way to separate concerns and structure user-interface code.

When using React to implement views, MVC supports one-way data flow.

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

## React as the V in MVC

React was originally designed as the V in MVC. From the [React GitHub page](https://github.com/facebook/react/tree/015833e5942ce55cf31aefd0a5c2be8a65ec2daa#:~:text=React%20as%20the-,V%20in%20MVC,-.%20Since%20React%20makes) in its early years:

> "Lots of people use React as the V in MVC."

This architecture takes that idea seriously. React does one thing exceptionally well: given a set of props, render a UI. This architecture keeps React in that lane. Views are pure rendering — no API calls, no navigation, no business logic. They receive props and render markup. That's it.

Controllers own everything else: fetching data, handling user actions, navigating between pages, managing page lifecycle. This is familiar to anyone who has built software in ASP.NET MVC, Rails, Spring MVC, or Django. The pattern is 20+ years old and well understood.

## What's Wrong with Hooks

Hooks were introduced in React 16.8 as a way to share logic between components without class inheritance. The tradeoff was steep.

**Hooks are neither object-oriented nor functional.** They look like function calls but they carry hidden state that persists across renders. Their behaviour depends on call order and component lifecycle in ways that are invisible from the call site. This is not functional programming — pure functions don't have hidden state. It is not object-oriented programming either — there are no objects, no encapsulation, no clear ownership. It is a third paradigm invented for React, and you have to learn it from scratch.

**The rules are unenforceable by the type system.** Don't call hooks conditionally. Don't call hooks in loops. Don't call hooks outside React functions. These rules exist because the implementation requires a stable call order across renders. The compiler cannot catch violations in all cases. Linting rules partially help, but they are not a substitute for a design that makes violations impossible.

**Stale closures are a silent failure mode.** When a `useEffect` or `useCallback` captures a variable from an outer scope, it captures the value at the time of the render that created it. If that value changes and the dependency array is wrong, the effect runs with stale data and produces incorrect behaviour. This class of bug is invisible at the call site, difficult to reproduce, and takes significant React experience to diagnose.

**Dependency arrays are manual and fragile.** `useEffect`, `useCallback`, `useMemo`, and `useRef` all require the developer to declare what values they depend on. Get it wrong and you have either a stale closure bug or an infinite render loop. The React team built an ESLint plugin to partially automate this, which is an acknowledgement that the design requires external tooling to use correctly.

**`useEffect` is routinely misunderstood.** It is marketed as a way to perform side effects, but its actual semantics — synchronising with an external system after every render — are subtle. Using it for data fetching, event subscriptions, or imperative DOM manipulation all require different and non-obvious patterns. Many React developers use it incorrectly for years before understanding what it actually does.

## What This Architecture Does Instead

**Controllers are plain TypeScript classes.** They have methods. Methods have a clear call order. There are no hidden rules, no dependency arrays, no closure semantics to reason about. `load` is called when the route matches. `unload` is called when navigating away.

**Views are pure rendering functions wrapped in classes.** A view receives props, maintains a small amount of UI state via `setState`, and renders markup. Reading a view tells you exactly what it renders. There is no logic to trace, no effects to audit, no hooks to follow.

**Page lifecycle is explicit.** The controller calls `createRoot` and `render` once. If the page needs updating after an async operation, the controller calls a setter method on the page instance. The page calls `setState`. React re-renders. Every step is visible and traceable.

**The separation is enforced by structure, not by convention.** In a hooks-based architecture, the rule "don't put business logic in components" is enforced only by team discipline. It is trivially easy to add an API call to a component and have it work. Over time, components accumulate logic and the architecture erodes. In this codebase, the view does not have access to `ApiClient`. The controller renders the view. The structure makes the violation unnatural.

## Comparison with Common Alternatives

### React with hooks and Context

The most common architecture today. Logic lives in components and custom hooks, shared state lives in Context or a state management library. The result is components that are difficult to test in isolation, context providers that create invisible dependencies between components, and custom hooks that are hard to trace because their behaviour depends on where they are called from. Every experienced React team has a document titled something like "how we structure our hooks" because the framework provides no guidance.

### Next.js

Next.js adds server-side rendering, file-based routing, server components, and a deployment platform to React. Each of these features adds concepts, configuration, and constraints. Server components introduce a new mental model where some components run on the server and some on the client, and the boundary between them must be managed carefully. If you are building a database management tool, a data pipeline UI, or any application that is inherently client-side, you are paying the full complexity cost of Next.js for none of the SEO or performance benefits it was designed to provide.

### React Router with loaders

React Router v6+ introduced loaders — functions that fetch data before a route renders. This is a step toward the controller pattern, but the implementation is coupled to the router's data model, returned as a special object, and consumed via a `useLoaderData` hook in the component. The logic is closer to the component than in a true MVC split, and the hook consumption reintroduces the problems described above.

In React Router, parts of a page are implemented as components that encapsulate both presentation and behavior. Behavior is distributed across the component tree. While components compose structurally, coordinating behavior across them requires explicit mechanisms such as prop drilling, context, or shared state stores.

In MVC the entire page is handled by a single controller. Even though multiple components are used to _render_ the page, the behavior is in a single controller, with functionality common to multiple pages being handled by a base controller. Communication between parts of the page is natural. Accessing functionality owned by an outer component is as simple as calling a base class method. Listening to events in an outer component is as simple as overriding a base class method.

React Router can swap just a nested section of the page on navigation, whereas MVC Router renders the full page on each route change. In practice this is rarely a disadvantage &mdash; in traditional web applications, a URL change implies a full page transition, which matches users' expectations.

## Demo App

For a real-world application written using MVC Router see [eureka!](https://github.com/Rajeev-K/eureka)

The included demo application uses React.js in the View layer, and has a master page that includes a top bar and left panel, dropdown menu, and dialogs.

![Demo App](/images/screenshot.png?raw=true "Screenshot")
