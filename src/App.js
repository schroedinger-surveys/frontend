import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import CreateSurvey from "./components/survey/CreateSurvey";
import SubmitSurvey from "./components/survey/SubmitSurvey";
import Search from "./components/Search/Search";
import NavbarMenu from "./components/menu/NavbarMenu";
import Register from "./components/home/Register";
import Login from "./components/home/Login";

function App() {
  return (
      <Router basename="ui">
          <NavbarMenu/>
          <Switch>
              <Route exact path="/" component={Home}/>
              <Route path="/register"><Register single={true}/></Route>
              <Route path="/login"><Login single={true}/></Route>
              <Route path="/dashboard" component={Dashboard}/>
              <Route exact path="/survey/create" component={CreateSurvey}/>
              <Route exact path="/survey/submission" component={SubmitSurvey}/>
              <Route exact path="/survey/search" component={Search}/>
          </Switch>
      </Router>
  );
}

export default App;
