import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {Provider} from 'react-redux';

import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import CreateSurvey from "./components/survey/CreateSurvey";
import SubmitSurvey from "./components/survey/SubmitSurvey";
import Search from "./components/Search/Search";
import NavbarMenu from "./components/menu/NavbarMenu";
import Register from "./components/home/Register";
import Login from "./components/home/Login";
import storageManager from "./storage/LocalStorageManager";
import Store from "./redux/store/Store";

function App() {
    return (
        <Provider store={Store}>
            <Router>
                <NavbarMenu/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/register"><Register single={true}/></Route>
                    <Route path="/login"><Login single={true}/></Route>
                    <ProtectedRoute path={"/dashboard"} component={Dashboard}/>
                    <ProtectedRoute path={"/survey/create"} component={CreateSurvey}/>
                    <Route exact path="/survey/submission" component={SubmitSurvey}/>
                    <Route exact path="/survey/search" component={Search}/>
                </Switch>
            </Router>
        </Provider>
    );
}

const ProtectedRoute = (props) => {
    const {path, component} = props;
    const validJWT = storageManager.searchForJWTToken();
    if (validJWT) {
        return (
            <Route path={path} component={component}/>
        )
    } else {
        return (<Redirect to={"/"}/>)
    }
}


export default App;
