import React from 'react';
import Modal from '../../components/UI/Modal/Modal';
// import Aux from '../Aux/Aux';

const withErrorHandler = (WrappedComponent, axios) => {
    return class extends React.Component {
        state = {
            error: null
        };

        componentWillMount() {
            this.reqInterceptor = axios.interceptors.request.use(req => {
                this.setState({ error: null });
                return req;
            });
            this.resInterceptor = axios.interceptors.response.use(
                res => res,
                error => {
                    this.setState({ error });
                    return error;
                }
            );
        }

        componentWillUnmount() {
            axios.interceptors.request.eject(this.reqInterceptor);
            axios.interceptors.response.eject(this.resInterceptor);
        }

        errorConfirmedHandler = () => this.setState({ error: null });

        render() {
            return (
                <>
                    {this.state.error ? (
                        <Modal
                            show={this.state.error ? this.state.error : false}
                            modalClosed={this.errorConfirmedHandler}
                        >
                            {this.state.error ? this.state.error.message : null}
                            kek
                        </Modal>
                    ) : null}
                    <WrappedComponent {...this.props} />
                </>
            );
        }
    };
};

export default withErrorHandler;
