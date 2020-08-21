import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route} from "react-router-dom";

import Home from "./components/Home";
import Dashboard from "./components/Dashboard";
import CreateSurvey from "./components/CreateSurvey";
import SubmitSurvey from "./components/SubmitSurvey";
import Search from "./components/Search";
import NavbarMenu from "./components/NavbarMenu";
import Register from "./components/Register";
import Login from "./components/Login";

function App() {
  return (
      <Router>
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
