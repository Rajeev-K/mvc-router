# How to run

Install dependencies by typing this command in the DemoApp folder:

    npm install

Start the development server by typing this command:

    npm run start:dev

Now open your web browser and point it to: http://localhost:9000

# Architecture

## App object
The application state is stored in this object.

## Model layer
Application data is supplied by objects in the model layer.
The model layer is independent of other layers.
Plain Old JavaScript Objects (POJO) are used as model objects.

## View layer
The View layer is built using React.js TSX templates.

## Controller layer
Controllers know about models and views. There is one-to-one correspondence between routes and controllers.
Controllers retrieve model objects and render the views with data from the model layer.
Controllers then handle UI events and modify model objects based on user input.
Controllers also alter the application route based on user action.

## Why MVC over a traditional React approach?

React applications tend to grow in complexity as behavior accumulates inside components. State management, data fetching, event handling, and navigation logic end up interleaved with rendering code. To coordinate across components, developers reach for prop drilling, context, state management libraries, or custom hooks &mdash; each adding a layer of indirection that makes the application harder to trace.

MVC avoids this by separating concerns along clear boundaries. The controller is the single place where page-level behavior lives: it fetches data, responds to user actions, coordinates between parts of the page, and decides when to navigate. The view is a pure function of its props &mdash; it renders UI and nothing else. The model holds application data independently of both.

This separation keeps each layer simple. Views don't need effects, reducers, or subscriptions. Controllers don't need JSX. Shared behavior across pages is handled through controller inheritance rather than wrapper components or context providers. The programming model is object-oriented and familiar to developers coming from server-side MVC frameworks.

React is still fully utilized for rendering &mdash; you get declarative updates, component composition, and the entire React ecosystem within each view. The MVC layer simply provides the structure above it, replacing the ad-hoc patterns that React applications typically evolve on their own.
