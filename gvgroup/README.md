# App

This project was generated with [Angular CLI](https://github.com/angular/angular-cli) version 18.0.7.

## Development server

Run `npm install` to install node modules and `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The application will automatically reload if you change any of the source files.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via a platform of your choice. To use this command, you need to first add a package that implements end-to-end testing capabilities.

## Manual testing

After running the application and navigating to the `http://localhost:4200/` the user will be greeted with a prepopulated user information and an `Edit profile` button. Clicking on this button will navigate the user to the profile edit form with required fields (First name, Last name, Email) and optional fields (Phone number, Profile Picture). Each field has a validation in place:

- First name: Cannot be empty
- Last name: Cannot be empty
- Email: Cannot be empty; Should be a valid email address
- Phone number: Should only be accepted with numbers
- Profile picture: Should only accept image files

The last step has two buttons - `Save` and `Cancel`.
`Save` button takes the form input values and saves them into Local Storage with a simulated mock API, which has a delay set to 1 second. While there is a delay a spinner appears over the form and a notification pops up at the bottom of the screen, informing the user if the profile information was updated successfuly. If it was successful, user will be navigated back to the main page of the application, with new information displayed.
`Cancel` button takes the user back to the main page with no changes applied.
