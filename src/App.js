import React, { useEffect, Suspense } from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { connect } from 'react-redux';
import Layout from './hoc/Layout/Layout';
import BurgerBuilder from './containers/BurgerBuilder/BurgerBuilder';
import Logout from './containers/Auth/Logout/Logout';
import * as actions from './store/actions/index';

const Checkout = React.lazy(() => {
    return import('./containers/Checkout/Checkout');
});
const Orders = React.lazy(() => {
    return import('./containers/Orders/Orders');
});
const Auth = React.lazy(() => {
    return import('./containers/Auth/Auth');
});

const App = (props) => {
    useEffect(() => {
        props.onTryAutoSignin();
    }, []);

    let routes = (
        <Switch>
            <Route path="/auth" component={Auth} />
            <Route path="/" exact component={BurgerBuilder} />
            <Redirect to="/" />
        </Switch>
    );

    if (props.isAuth) {
        routes = (
            <Switch>
                <Route path="/checkout" component={Checkout} />
                <Route path="/orders" component={Orders} />
                <Route path="/logout" component={Logout} />
                <Route path="/auth" component={Auth} />
                <Route path="/" exact component={BurgerBuilder} />
                <Redirect to="/" />
            </Switch>
        );
    }
    return (
        <Layout>
            <Suspense fallback={<p>Loading...</p>}>{routes}</Suspense>
        </Layout>
    );
};

const mapStateToProps = (state) => {
    return {
        isAuth: state.auth.token !== null
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onTryAutoSignin: () => dispatch(actions.authCheckState())
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(App);
