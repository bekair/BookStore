import { FormControlLabel, Grid, Link, Radio, RadioGroup, TextField, FormControl } from '@material-ui/core';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import { Theme, withStyles, WithStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import Typography from '@material-ui/core/Typography';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined';
import axios, { AxiosResponse } from 'axios';
import * as React from 'react';
import { ChangeEvent } from 'react';
import { withRouter } from 'react-router-dom';
import { EnumMessageType } from '../enums/EnumMessageType';
import { EnumUserType } from '../enums/EnumUserType';
import MessageBox from './MessageBox';
import { RouterProps } from 'react-router';

export interface SignUpProps extends WithStyles<any>, RouterProps {
    classes: any,
    signedUp: boolean
}

export interface SignUpState {
    username: string
    email: string,
    password: string,
    firstName: string,
    lastName: string,
    phoneNumber: number,
    isSignedUp: boolean,
    willMessageShown: boolean,
    userType: EnumUserType
}

const styles = (theme: Theme) => ({
    formControl: {
        margin: theme.spacing.unit * 3,
        display: 'inline-block'
    },
    root: {
        flexGrow: 1
    },
    paper: {
        marginTop: theme.spacing.unit * 8,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing.unit * 1,
        backgroundColor: theme.palette.primary.main
    },
    form: {
        width: '60%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit * 3
    },
    submit: {
        margin: theme.spacing.unit * 3 * 0 * 2
    },
    heading: {
        color: '#002884'
    }
} as Record<string, CSSProperties>);

let informationMessage = "";

class SignUp extends React.Component<SignUpProps, SignUpState>{
    constructor(props: SignUpProps) {
        super(props);

        this.state = {
            username: '',
            email: '',
            password: '',
            firstName: '',
            lastName: '',
            phoneNumber: 0,
            isSignedUp: false,
            willMessageShown: false,
            userType: EnumUserType.Buyer
        };
    }

    handleUsernameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            username: event.currentTarget.value
        });
    }

    handleEmailChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            email: event.currentTarget.value
        });
    }

    handlePasswordChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            password: event.currentTarget.value
        });
    };

    handleFirstNameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            firstName: event.currentTarget.value
        });
    };

    handleLastNameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            lastName: event.currentTarget.value
        });
    };

    handlePhoneNumberChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            phoneNumber: Number(event.currentTarget.value == '' ? 0 : event.currentTarget.value)
        });
    };

    handleUserTypeChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            userType: EnumUserType[event.currentTarget.value]
        });
    }

    handleSignUp = () => {
        const url = `/api/Login/CreateUserAsync`;
        let isSucceeded = null;
        let currentState = this.state;

        const signUpParams = {
            FirstName: currentState.firstName,
            LastName: currentState.lastName,
            UserName: currentState.username,
            Email: currentState.email,
            Password: currentState.password,
            PhoneNumber: currentState.phoneNumber,
            UserType: currentState.userType
        };

        axios.post(url, JSON.stringify(signUpParams), {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse<any>) => {
            informationMessage = "";

            const data = response.data;
            if (!data.IsSucceeded) {
                data.forEach((error: any) => {
                    informationMessage += error.ExceptionMessage + "\n";
                });

                isSucceeded = false;
            }
            else {
                isSucceeded = true;
                informationMessage = "The person signed up successfully."
            }

            this.setState({
                isSignedUp: isSucceeded,
                willMessageShown: true
            });
        });
    };

    renderRedirectToHome = () => {
        if (this.state.isSignedUp) {

            const location = {
                pathname: '/',
                state: {
                    informationMessage: informationMessage,
                    messageType: EnumMessageType.Success,
                    isMessageShown: this.state.isSignedUp,
                    isLoggedIn: false
                }
            };
            this.props.history.push(location);
        }
    }

    handleMessageBoxClose = () => {
        this.setState({
            willMessageShown: false
        });
    }

    renderErrorMessage = () => {
        if ((!this.state.isSignedUp) && (this.state.willMessageShown)) {
            return (
                <Grid container justify={"flex-end"} className={"{root:{flexGrow:1}}"}>
                    <MessageBox
                        isOpened={true}
                        messageType={EnumMessageType.Error}
                        onClose={this.handleMessageBoxClose}
                    >
                        {informationMessage}
                    </MessageBox >
                </Grid>
            );
        }
        else {
            return '';
        }
    }

    render() {
        const { classes } = this.props;
        const { userType } = this.state;

        return (

            <Grid container justify={"center"} className={classes.root}>
                {this.renderRedirectToHome()}
                {this.renderErrorMessage()}

                <CssBaseline />
                <div className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockOutlinedIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        className={classes.heading}
                    >
                        Sign Up
                    </Typography>

                    <form className={classes.form} noValidate>
                        <Grid container className={classes.root} spacing={16}>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    autoComplete="firstName"
                                    name="firstName"
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="firstName"
                                    label="First Name"
                                    autoFocus
                                    onChange={this.handleFirstNameChange}
                                />
                            </Grid>

                            <Grid item xs={12} sm={6}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="lastName"
                                    label="Last Name"
                                    name="lastName"
                                    autoComplete="lastName"
                                    onChange={this.handleLastNameChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    id="email"
                                    label="Email Address"
                                    name="email"
                                    autoComplete="email"
                                    onChange={this.handleEmailChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="username"
                                    label="Username"
                                    id="username"
                                    autoComplete="username"
                                    onChange={this.handleUsernameChange}
                                />
                            </Grid>

                            <Grid item xs={12}>
                                <TextField
                                    variant="outlined"
                                    required
                                    fullWidth
                                    name="password"
                                    label="Password"
                                    type="password"
                                    id="password"
                                    autoComplete="password"
                                    onChange={this.handlePasswordChange}
                                />
                            </Grid>

                            <FormControl
                                component="div"
                                className={classes.formControl}
                                fullWidth
                            >
                                <RadioGroup
                                    aria-label="userType"
                                    name="userType"
                                    value={EnumUserType[userType]}
                                    defaultValue={EnumUserType[userType]}
                                    onChange={this.handleUserTypeChange}
                                >
                                    <FormControlLabel
                                        value={EnumUserType[EnumUserType.Buyer]}
                                        control={<Radio />}
                                        label={EnumUserType[EnumUserType.Buyer]}
                                    />

                                    <FormControlLabel
                                        value={EnumUserType[EnumUserType.Seller]}
                                        control={<Radio />}
                                        label={EnumUserType[EnumUserType.Seller]}
                                    />
                                </RadioGroup>
                            </FormControl>

                            <Grid item xs={12}>
                                <Button
                                    type="button"
                                    fullWidth
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.handleSignUp}
                                >
                                    Sign Up
                                </Button>
                            </Grid>

                        </Grid>

                        <Grid container justify="flex-end" spacing={16}>
                            <Grid item>
                                <Link href="/" variant="body2">
                                    Already have an account? Sign in
                                </Link>
                            </Grid>
                        </Grid>
                    </form>
                </div>

                <Grid xs={12}>
                    <Typography variant="body2" color="textSecondary" align="center">
                        {'Built with love by the '}
                        <Link color="inherit" href="https://material-ui.com/">
                            Material-UI
                        </Link>
                        {' team.'}
                    </Typography>
                </Grid>

            </Grid >

        );
    }
}

export default withRouter(withStyles(styles)(SignUp) as any) as any;