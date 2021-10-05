import * as React from 'react';
import Avatar from '@material-ui/core/Avatar';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import FormControl from '@material-ui/core/FormControl';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Input from '@material-ui/core/Input';
import InputLabel from '@material-ui/core/InputLabel';
import LockIcon from '@material-ui/icons/LockOutlined';
import Paper from '@material-ui/core/Paper';
import Typography from '@material-ui/core/Typography';
import { withStyles, Theme, WithStyles } from '@material-ui/core/styles';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { ChangeEvent } from 'react';
import axios, { AxiosResponse } from 'axios';
import { EnumMessageType } from '../enums/EnumMessageType';
import { EnumUserType } from '../enums/EnumUserType';

export interface SignInProps extends WithStyles<any> {
    classes: any,
    loggedIn: any
}

export interface SignInState {
    username: string,
    password: string,
    rememberMe: Boolean
}

const styles = (theme: Theme) => ({
    main: {
        width: 'auto',
        display: 'block',
        marginLeft: theme.spacing.unit * 3,
        marginRight: theme.spacing.unit * 3,
        [theme.breakpoints.up(300 + theme.spacing.unit * 3 * 2)]: {
            width: 300,
            marginLeft: 'auto',
            marginRight: 'auto',
        },
    },
    paper: {
        marginTop: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 3}px ${theme.spacing.unit * 3}px`,
    },
    avatar: {
        margin: theme.spacing.unit,
        backgroundColor: theme.palette.primary.main,
    },
    form: {
        width: '100%',
        marginTop: theme.spacing.unit,
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    heading: {
        color: '#002884'
    }
} as Record<string, CSSProperties>);

class SignIn extends React.Component<SignInProps, SignInState> {

    constructor(props: SignInProps) {
        super(props);

        this.state = {
            username: '',
            password: '',
            rememberMe: false
        };
    }

    handleUsernameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            username: event.currentTarget.value
        });
    }

    handlePasswordChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            password: event.currentTarget.value
        });
    };

    handleRememberMeChange = (event: ChangeEvent<{}>, checked: boolean) => {
        this.setState({
            rememberMe: checked
        })
    };


    handleSignIn = () => {
        const url = `/api/Login/Login`;
        let currentState: SignInState = this.state;
        let informationMessage: string = "";
        let messageType: EnumMessageType = null;
        let isSucceeded: boolean = false;

        const loginParams = {
            UserName: currentState.username,
            Password: currentState.password,
            RememberMe: currentState.rememberMe
        };

        const result = axios.post(url, JSON.stringify(loginParams), {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });

        result.then((response: AxiosResponse<any>) => {
            const data = response.data;

            if (!data.IsSucceeded) {
                isSucceeded = false;
                informationMessage = response.data.ExceptionMessage;
                messageType = EnumMessageType.Error;
            }
            else {
                isSucceeded = true;
                informationMessage = `${data.UserName} is successfully signed in.`;
                messageType = EnumMessageType.Success;
            }

            this.setState({
                username: '',
                password: '',
                rememberMe: false
            })

            //Call the updateMenuLoggedIn method in MenuBar to control if it is logged in or not
            this.props.loggedIn(isSucceeded, informationMessage, messageType);
        });

    };

    render() {
        const { classes } = this.props;
        const { username, password, rememberMe } = this.state;

        return (
            <main className={classes.main}>

                <CssBaseline />
                <Paper className={classes.paper}>
                    <Avatar className={classes.avatar}>
                        <LockIcon />
                    </Avatar>
                    <Typography
                        component="h1"
                        variant="h5"
                        className={classes.heading}
                    >
                        Sign In
                    </Typography>

                    <form className={classes.form}>

                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="username">Username</InputLabel>
                            <Input
                                id="username" name="username" value={username}
                                autoComplete="username" autoFocus
                                onChange={this.handleUsernameChange}
                            />
                        </FormControl>

                        <FormControl margin="normal" required fullWidth>
                            <InputLabel htmlFor="password">Password</InputLabel>
                            <Input
                                name="password" type="password" value={password}
                                id="password" autoComplete="current-password"
                                onChange={this.handlePasswordChange}
                            />
                        </FormControl>

                        <FormControlLabel
                            control={<Checkbox value="remember" color="primary" onChange={this.handleRememberMeChange} />}
                            label="Remember me"
                        />

                        <Button
                            type="button"
                            fullWidth
                            variant="contained"
                            color="primary"
                            className={classes.submit}
                            onClick={this.handleSignIn}
                        >
                            Sign in
                        </Button>

                    </form>
                </Paper>
            </main>
        );
    }
}

export default withStyles(styles)(SignIn);