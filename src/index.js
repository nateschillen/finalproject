import React from "react";
import ReactDOM from "react-dom";
import "./index.css";
import * as serviceWorker from "./serviceWorker";
import { App } from "./App";
import { BrowserRouter, Route } from "react-router-dom";
import { SignIn } from "./SignIn";
import { SignUp } from "./SignUp";

ReactDOM.render(
  <BrowserRouter>
    <div>
      <Route exact path="/" component={SignIn} />
      <Route path="/signup" component={SignUp} />
      <Route path="/app" component={App} />
    </div>
  </BrowserRouter>,
  document.getElementById("root")
);

serviceWorker.unregister();