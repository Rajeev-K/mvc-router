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
