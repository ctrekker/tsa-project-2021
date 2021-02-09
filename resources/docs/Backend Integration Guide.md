# Backend Integration Guide
This is a tough stage in project development because it is an intersection between frontend and backend, and therefore requires moderate knowledge about both.

## Interpretting Backend Documentation
All the backend documentation can be found on [this google doc](https://docs.google.com/document/d/1zMg6Oa5fZiS6xxUOb6NDL9Fcb83zdYf47SndXzATZG4/edit). But this can be a little cryptic to read, so below are some instructions on how to interpret them.

### REST
We will be following (in general) RESTful design standards for our API. All this means is that backend information is treated as a set of *resources*. All information about resources is transmitted over HTTP(s).
> A resource is an object with a type, associated data, relationships to other resources, and a set of methods that operate on it.

### Request Method
There are 4 different request methods that we will be using for this project. Each one has an associated action on some backend resource. They are:

* **GET** - Does what you think it will. Gets a resource or a list of resources
* **POST** - Creates a new thing. This could be a new lobby, new class, or any other resource
* **PUT** - Updates an existing thing. Can be thought of as **editing**
* **DELETE** - Does what you think it will. Deletes a resource

For example, to get a list of lobby resources you would make a `GET` request, and if you wanted to make a new lobby you would make a `POST` request.

### Request Endpoints
There are a bunch of rules here, but knowing what they are isn't really necessary for integration. Just know that endpoint paths have to match what they are in the documentation before the question mark (if there is one). Question marks represent what's called *query parameters* and are always optional.
```
↓ Method   ↓ Resource URL  ↓ Optional query params
GET        /<resource>/... ?<param>=<param_val>
```
Generally speaking, optional elements are surrounded with square brackets `[]` and default parameters or values are surrounded with parenthesis `()`.

### Request Inputs and Outputs
For **GET** requests no input beyond the parameters present in the URL (prefixed with `:`) can be attached. However for **POST**, **PUT**, and **DELETE**, something called a *request body* can be optionally sent. A *request body* must be encoded in a JSON string. The fields which can or must be included are denoted by the pseudo-destructuring syntax present after the `←` symbol. 

The same is true of outputs, except in reverse. Output comes in the form of a JSON encoded *response body*. Fields are once again specificed by pseudo-destructuring syntax, and is denoted by everything after the `→` arrow.

## Performing backend requests in frontend code
There are several utility methods which make requesting to backend endpoints more intuitive. To gain access to these utility methods simply use the following import:
```
import Config from '../Config';
```
As an example let's make a get request to the lobby classes endpoint. First we need to obtain the URL to request:
```
const lobbyId = 5; // Change this to be dynamic
const url = Config.endpoint(`/lobbies/${lobbyId}/classes/`);
console.log(url);
```
On a development server, this code will print `http://localhost:8000/lobbies/5/classes/`.

Now we need to `fetch` that endpoint and read the content back. To do this use yet another config method called `Config.fetch`. Note that this method is defined as `async`, so either using `await` or standard `Promise` syntax is a must.
```
Config.fetch(url).then(response => {
    console.log(response);
    // TODO: Do something with this response!
}).catch(err => {
    console.log(err);
    // TODO: Do something with this error!
});
```

## Integrating with React
### State
React encapsulates all DOM updates in terms of updating some JavaScript state. To add state to a component or view, we use something called a React *hook*. In this case, the hook we will be using is `useState`. This can be imported with the following:
```
import React, { useState } from 'react';
```
Then as long as you are using a function component, the following code can be used to add state:
```
const [stateVar, setStateVar] = useState("some initial state");
```
The `stateVar` contains the current value of the state, and `setStateVar` is a function which takes 1 parameter which will, when called, set the `stateVar` to the value of the parameter.
> You **CANNOT** set state variables by mutation, which means you can't do `stateVar = "new value"`

### Effects
Now we need a mechanism to update the state when the component loads.
1. Component loads up with initial state
2. Create an effect which will initiate a backend request
3. Update the state once the backend request returns

The best way to explain this is with a simple pseudo-view  example.
```
function SomeView(props) {
    const [content, setContent] = useState('Loading...');

    useEffect(async () => {
        const res = await Config.fetch(Config.endpoint('/content/'));
        setContent(res.content);
    }, [setContent]);

    return (
        <p>
            ${content}
        </p>
    );
}
```
Note that `/content/` does not exist and no imports are shown in this example. The important thing here is that it follows the 3-step approach highlighted above.

### Dynamic Content
Content will often change in reaction to some user response, such as clicking a button. Handling this is identical to handling the view load case above, but instead of placing request code within a `useEffect` callback it will simply be placed in the user event callback.