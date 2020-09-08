import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import {BrowserRouter as Router, Switch, Route, Redirect} from "react-router-dom";
import {Provider} from 'react-redux';

import Home from "./components/home/Home";
import Dashboard from "./components/dashboard/Dashboard";
import CreateSurvey from "./components/survey/CreateSurvey";
import Search from "./components/search/Search";
import NavbarMenu from "./components/menu/NavbarMenu";
import Register from "./components/home/Register";
import Login from "./components/home/Login";
import storageManager from "./storage/LocalStorageManager";
import {createStore} from "redux";
import RootReducer from "./redux/reducer/RootReducer";
import PublicSurvey from "./components/survey/survey-submission/PublicSurvey";
import PrivateSurvey from "./components/survey/survey-submission/PrivateSurvey";
import SurveyOverview from "./components/menu/side-menu/components/SurveyOverview";


function App() {
    return (
        <Provider store={createStore(RootReducer)}>
            <Router>
                <NavbarMenu/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route path="/register"><Register single={true}/></Route>
                    <Route path="/login"><Login single={true}/></Route>
                    <ProtectedRoute path={"/dashboard"} component={Dashboard}/>
                    <ProtectedRoute path={"/survey/create"} component={CreateSurvey}/>
                    <ProtectedRoute path={"/survey/overview"} component={SurveyOverview}/>
                    <Route exact path="/survey/search" component={Search}/>
                    <Route path={"/pub/:id"} component={PublicSurvey}/>
                    <Route path={"/s/:id"} component={PrivateSurvey}/>
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
