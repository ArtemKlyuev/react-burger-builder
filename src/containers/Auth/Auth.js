import React, { useState, useEffect } from 'react';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';

const Auth = (props) => {
    const [authForm, setAuthForm] = useState({
        email: {
            elementType: 'input',
            elementConfig: {
                type: 'email',
                placeholder: 'E-mail address'
            },
            value: '',
            validation: {
                required: true,
                isEmail: true
            },
            valid: false,
            touched: false
        },
        password: {
            elementType: 'input',
            elementConfig: {
                type: 'password',
                placeholder: 'Password'
            },
            value: '',
            validation: {
                required: true,
                minLength: 6
            },
            valid: false,
            touched: false
        }
    });

    const [isSignup, setIsSignUp] = useState(true);

    useEffect(() => {
        if (!props.building && !props.authRedirectPath !== '/') {
            props.onSetAuthRedirectPath();
        }
    }, []);

    const inputChangedHandler = (e, controlName) => {
        const updatedControls = updateObject(authForm, {
            [controlName]: updateObject(authForm, {
                value: e.target.value,
                valid: checkValidity(
                    e.target.value,
                    authForm[controlName].validation
                ),
                touched: true
            })
        });

        setAuthForm(updatedControls);
    };

    const submitHandler = (e) => {
        const { email, password } = authForm;

        console.log('[Submit handler signup]', isSignup);

        e.preventDefault();
        props.onAuth(email.value, password.value, isSignup);
    };

    const switchAuthHandler = () => {
        setIsSignUp(!isSignup);

        console.log('[swithAuth]', isSignup);
    };

    const formElementsArray = [];

    Object.keys(authForm).forEach((key) =>
        formElementsArray.push({
            id: key,
            config: authForm[key]
        })
    );

    let form = formElementsArray.map((formEl) => (
        <Input
            key={formEl.id}
            elementType={formEl.config.elementType}
            elementConfig={formEl.config.elementConfig}
            defaultValue={formEl.config.value}
            invalid={!formEl.config.valid}
            shouldValidate={formEl.config.validation}
            touched={formEl.config.touched}
            changed={(event) => inputChangedHandler(event, formEl.id)}
        />
    ));

    const signText = isSignup ? 'SIGN UP' : 'SIGN IN';

    if (props.loading) {
        form = <Spinner />;
    }

    let errorMsg = null;

    console.log('this.props.error', props.error);

    if (props.error) {
        errorMsg = <p>{props.error.message}</p>;
    }

    let authRedirect = null;

    if (props.isAuth) {
        authRedirect = <Redirect to={props.authRedirectPath} />;
    }

    return (
        <div className={classes.Auth}>
            {authRedirect}
            {errorMsg}
            <form onSubmit={submitHandler}>
                {form}
                <Button btnType="Success">SUBMIT</Button>
            </form>
            <Button clicked={switchAuthHandler} btnType="Danger">
                SWITCH TO {signText}
            </Button>
        </div>
    );
};

const mapStateToProps = (state) => {
    return {
        loading: state.auth.loading,
        error: state.auth.error,
        isAuth: state.auth.token !== null,
        building: state.burgerBuilder.building,
        authRedirectPath: state.auth.authRedirectPath
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onAuth: (email, password, isSignup) =>
            dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/'))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Auth);
