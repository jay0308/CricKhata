import React from "react";
import {
    BrowserRouter as Router,
    Switch,
    Route,
    Link
} from "react-router-dom";
import Header from "./components/header";
import Footer from "./components/footer";
import Home from "./components/home";

class Routes extends React.Component {
    render() {
        return (
            <Router>
                <div>
                    <Header/>
                    <Switch>
                        <Route exact path="/">
                            <Home/>
                        </Route>
                    </Switch>
                    <Footer/>
                </div>
            </Router>
        )
    }
}

export default Routes;