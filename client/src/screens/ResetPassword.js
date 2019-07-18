import ButtonMU from '@material-ui/core/Button';
import axios from 'axios';
import React, { Component } from 'react';
import { withAlert } from 'react-alert';
import { Redirect } from 'react-router-dom';
import { Input } from 'semantic-ui-react';
import config from '../config';
import '../css/Main.css';

class ResetPassword extends Component {

    constructor(props) {
        super(props);
        this.state = {
            inputs: {
                password:''
            },
            errors:{},
            token:this.props ? this.props.match.params.token : '', // check if there is params and set the token if so 
            email:this.props ? this.props.match.params.email : '',  // check if there is params and set the email if so 
            redirectToLogin:false
        }
    }


    // add the inputs values in theire [name] in state
    handleInput = (e) => {
        let target = e.target;
        let name = target.name;
        this.cleanErrors(name); // on each type clean the errors to remove the "error" mark on each input
        let value = target.value;
        const {inputs} = this.state;
        inputs[name] = value;
        this.setState({inputs}, () => config.alertD(this.state.inputs[name])); // add the input in its proper property in the <inputs> object in state
    }


    // clean the errors from the <errors> object in the state
    cleanErrors = (name) => {
        const {errors} = this.state;
        errors[name] = false;
        errors.errStatus = '';
        if (name == 'email') {
            errors.isEmailErr = false;
        }
        this.setState({errors});
    }


    // clean the errors from the <errors> object in the state
    isInputEmpty = () => {
        const {inputs, errors} = this.state;
        for (let key in inputs) {
            if (inputs[key].length == 0) {
                errors[key] = true;
            }
        }
        if (inputs.password.length < 6) {
            errors.password = true;
        }
        config.alertD('errors.password.length', errors.password)
        this.setState({errors}, () => config.alertD(this.state.errors))
    }


    // simple login
    Reset = (e) => {
        e.preventDefault()
        this.isInputEmpty()
        if (this.state.inputs.password && this.state.inputs.password.length >= 6) {
            axios.post(`${config.backEndServer}/resetpasswordhandler`, {
                password:this.state.inputs.password,
                token:this.state.token,
                email:this.state.email
            })
            .then((res) => {
                config.alertD('response on changing pw', res.status)
                if (res.status == 200 || res.status == 204) {
                    this.props.alert.show('password changed')
                    this.setState({redirectToLogin:true}) // redirect to 
                }
            })
            .catch(e => console.log('couldnt login', e))
        }
    }


    render() {
        return(
            <div className='admin-signup-section container-signup container'>
            {
                this.state.redirectToLogin ? <Redirect to={{
                    pathname: '/admin',
                    state: { reset: true }
                }}/> : null
            }
                <h3 className='forgot-pass'>Reset password</h3>
                <div>
                    <div>
                        <Input error={this.state.errors.password ? true : false}  className='admin-form' onChange={e => this.handleInput(e)} value={this.state.inputs.password} name="password" type="password"  placeholder="password" />
                    </div>

                    {this.state.inputs.password.length < 6 && this.state.errors.password ? <label style={{color:'red'}}>&nbsp; pw must be at least 6 chars</label> : null}  

                    <br/>

                    <div>
                        <ButtonMU variant="contained" color="primary" onClick={this.Reset}>set password</ButtonMU>
                    </div>

                </div> 
            </div>  
        )
    }
}

export default withAlert(ResetPassword)