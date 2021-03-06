import "react-app-polyfill/ie9"; // For IE 9-11 support
import "react-app-polyfill/ie11"; // For IE 11 support
import "react-app-polyfill/stable";

import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter, Route, Switch, Redirect } from "react-router-dom";

import "assets/vendor/nucleo/css/nucleo.css";
import "assets/vendor/font-awesome/css/font-awesome.min.css";
import "assets/scss/argon-design-system-react.scss?v1.1.0";

// Views

import Landing from "views/pages/Landing.js";
import Login from "views/pages/Login.js";
// import Profile from 'views/pages/Profile.js';
import Register from "views/pages/Register.js";
import Activity from "views/pages/Activity.js";
import Curriculum from "views/pages/Curriculum.js";
import Budget from "views/pages/Budget.js";
import Rule from "views/pages/Rule.js";
import Day from "views/pages/Day.js";
import Idea from "views/pages/Idea.js";

// Reducer
import { Provider } from "react-redux";
import { createStore, compose, applyMiddleware } from "redux";
import reduxThunk from "redux-thunk";
import reducers from "./reducers";

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(reducers, composeEnhancer(applyMiddleware(reduxThunk)));

ReactDOM.render(
   <Provider store={store}>
      <BrowserRouter>
         <Switch>
            <Route path="/" exact component={Landing} />
            <Route path="/landing-page" exact component={Landing} />
            <Route path="/login-page" exact component={Login} />
            {/* <Route
          path='/profile-page'
          exact
          render={(props) => <Profile {...props} />}
        /> */}
            <Route path="/register-page" exact component={Register} />

            <Route path="/activity" exact component={Activity} />
            <Route path="/curriculum" exact component={Curriculum} />
            <Route path="/budget" exact component={Budget} />
            <Route path="/rule" exact component={Rule} />
            <Route path="/idea" exact component={Idea} />
            <Route path="/day" exact component={Day} />
            <Redirect to="/landing-page" />
         </Switch>
      </BrowserRouter>
   </Provider>,
   document.getElementById("root")
);
