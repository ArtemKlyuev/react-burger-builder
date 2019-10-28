import React, { Component } from 'react';
import * as actions from '../../store/actions/index';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import { updateObject, checkValidity } from '../../shared/utility';

import Input from '../../components/UI/Input/Input';
import Button from '../../components/UI/Button/Button';
import Spinner from '../../components/UI/Spinner/Spinner';
import classes from './Auth.module.css';

class Auth extends Component {
    state = {
        controls: {
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
        },
        isSignup: true
    };

    componentDidMount() {
        if (!this.props.building && !this.props.authRedirectPath !== '/') {
            this.props.onSetAuthRedirectPath();
        }
    }

    inputChangedHandler = (e, controlName) => {
        const updatedControls = updateObject(this.state.controls, {
            [controlName]: updateObject(this.state.controls[controlName], {
                value: e.currentTarget.value,
                valid: checkValidity(
                    e.currentTarget.value,
                    this.state.controls[controlName].validation
                ),
                touched: true
            })
        });
        this.setState({ controls: updatedControls });
    };

    submitHandler = (e) => {
        const { email, password } = this.state.controls;
        const { isSignup } = this.state;
        console.log('[Submit handler signup]', isSignup);
        e.preventDefault();
        this.props.onAuth(email.value, password.value, isSignup);
    };

    switchAuthHandler = () => {
        this.setState((prevState) => {
            return { isSignup: !prevState.isSignup };
        });
        console.log('[swithAuth]', this.state.isSignup);
    };

    render() {
        const formElementsArray = [];
        Object.keys(this.state.controls).forEach((key) =>
            formElementsArray.push({
                id: key,
                config: this.state.controls[key]
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
                changed={(event) => this.inputChangedHandler(event, formEl.id)}
            />
        ));

        const signText = this.state.isSignup ? 'SIGN UP' : 'SIGN IN';

        if (this.props.loading) {
            form = <Spinner />;
        }

        let errorMsg = null;
        console.log('this.props.error', this.props.error);
        if (this.props.error) {
            errorMsg = <p>{this.props.error.message}</p>;
        }

        let authRedirect = null;
        if (this.props.isAuth) {
            authRedirect = <Redirect to={this.props.authRedirectPath} />;
        }

        return (
            <div className={classes.Auth}>
                {authRedirect}
                {errorMsg}
                <form onSubmit={this.submitHandler}>
                    {form}
                    <Button btnType="Success">SUBMIT</Button>
                </form>
                <Button clicked={this.switchAuthHandler} btnType="Danger">
                    SWITCH TO {signText}
                </Button>
            </div>
        );
    }
}
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
