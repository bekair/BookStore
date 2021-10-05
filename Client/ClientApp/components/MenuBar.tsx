import * as React from 'react';
import axios, { AxiosResponse } from 'axios';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import Badge from '@material-ui/core/Badge';
import MenuItem from '@material-ui/core/MenuItem';
import Menu from '@material-ui/core/Menu';
import { withStyles, Theme, WithStyles, createMuiTheme, MuiThemeProvider } from '@material-ui/core/styles';
import ShopIcon from '@material-ui/icons/Shop';
import MenuIcon from '@material-ui/icons/Menu';
import InputIcon from '@material-ui/icons/Input';
import BookIcon from '@material-ui/icons/Book'
import LockOpen from '@material-ui/icons/LockOpen';
import Lock from '@material-ui/icons/Lock';
import AccountCircle from '@material-ui/icons/AccountCircle';
import MailIcon from '@material-ui/icons/Mail';
import NotificationsIcon from '@material-ui/icons/Notifications';
import MoreIcon from '@material-ui/icons/MoreVert';
import ShoppingCartIcon from '@material-ui/icons/ShoppingCart';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import SearchBar from './SearchBar';
import Button from '@material-ui/core/Button';
import classNames from 'classnames';
import { fade } from '@material-ui/core/styles/colorManipulator';
import Grid from '@material-ui/core/Grid';
import SignIn from './SignIn';
import { EnumMessageType } from '../enums/EnumMessageType';
import { RouterProps, withRouter } from 'react-router';
import { EnumUserType } from '../enums/EnumUserType';


export interface MenuBarProps extends WithStyles<any>, RouterProps {
    classes: any
}

export interface MenuBarState {
    anchorEl: any,
    mobileMoreAnchorEl: any,
    loggedIn: boolean,
    userType: EnumUserType,
    isSignInPopupOpened: Boolean,
    isSignInSubmitted: Boolean,
    fetchCompleted: boolean
}


const theme = createMuiTheme({
    palette: {
        primary: {
            light: '#757ce8',
            main: '#002884',
            dark: '#3f50b5',
            contrastText: '#fff',
        },
        secondary: {
            light: '#E53935',
            main: '#D50000',
            dark: '#F44336',
            contrastText: '#fff',
        },

    },
});

const styles = (theme: Theme) => ({
    root: {
        width: '100%'
    },
    grow: {
        flexGrow: 1,
    },
    menuButton: {
        marginLeft: -12,
        marginRight: 20,
    },
    title: {
        display: 'none',
        [theme.breakpoints.up('sm') as string]: {
            display: 'block',
        },
        cursor: 'pointer'
    },
    sectionDesktop: {
        marginRight: theme.spacing.unit * 2,
        zIndex: 2,
        display: 'none',
        [theme.breakpoints.up('md') as string]: {
            display: 'flex',
        },
    },
    sectionMobile: {
        display: 'flex',
        [theme.breakpoints.up('md') as string]: {
            display: 'none',
        },
    },
    rightIcon: {
        marginLeft: theme.spacing.unit,
        marginRight: theme.spacing.unit,
    },
    iconSmall: {
        fontSize: 20
    },
    buttonDesktop: {
        minWidth: "150px",
        margin: theme.spacing.unit,
        border: '2px solid #64dd17',
        color: '#64dd17',
        transition: theme.transitions.create('width') as string,
        textTransform: "none",
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
    },
    buttonMobile: {
        minWidth: "150px",
        margin: theme.spacing.unit,
        transition: theme.transitions.create('width') as string,
        textTransform: "none",
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25)
        },
    },
    grid: {
        position: 'absolute',
        verticalAlign: 'top'
    },
    signInGridMobile: {
        position: 'absolute',
        verticalAlign: 'top',
        marginRight: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 2
    }
} as Record<string, CSSProperties>);

class MenuBar extends React.Component<MenuBarProps, MenuBarState> {

    constructor(props: MenuBarProps) {
        super(props);

        this.state = {
            anchorEl: null,
            mobileMoreAnchorEl: null,
            loggedIn: false,
            isSignInPopupOpened: false,
            isSignInSubmitted: false,
            userType: EnumUserType[''],
            fetchCompleted: false
        };
    }

    componentDidMount() {
        let url = '/api/Login/IsLoggedIn';
        axios.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse) => {
            const loggedIn = response.data;
            url = '/api/User/GetUserTypeOfLoggedInUser';

            axios.get(url, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then((response: AxiosResponse) => {
                const userType: EnumUserType = response.data;

                this.setState({
                    loggedIn: loggedIn,
                    userType: userType,
                    fetchCompleted: true
                });

                //Just one time compilation. When the application is started and refresh the page when at the home page.   
                if (this.props.history.location.pathname === '/') {
                    const location = {
                        pathname: '/',
                        state: {
                            isLoggedIn: loggedIn,
                            userType: userType,
                            informationMessage: '',
                            messageType: EnumMessageType.Error,
                            isMessageShown: false,
                        }
                    };
                    this.props.history.push(location);
                }
            });
        });
    }

    handleProfileMenuOpen = (event: any) => {
        this.setState({ anchorEl: event.currentTarget });
    };

    handleCartOpen = () => {

    }

    handleMenuClose = () => {
        this.setState({ anchorEl: null });
        this.handleMobileMenuClose();
    };

    handleMobileMenuOpen = (event: any) => {
        this.setState({ mobileMoreAnchorEl: event.currentTarget });
    };

    handleMobileMenuClose = () => {
        this.setState({
            mobileMoreAnchorEl: null
        });
    };

    buttonSignUpOnClick = () => {
        const location = {
            pathname: '/signUp'
        };

        this.props.history.push(location);
    }

    buttonSignInOnClick = () => {
        this.setState({
            isSignInPopupOpened: !this.state.isSignInPopupOpened
        });
    }

    buttonMyLibraryClick = () => {
        this.setState({
            isSignInPopupOpened: false,
            anchorEl: null,
            mobileMoreAnchorEl: null
        });

        const location = {
            pathname: '/SellerBookLibrary'
        };

        this.props.history.push(location);
    }

    buttonCartOpenClick = () => {
        this.setState({
            isSignInPopupOpened: false,
            anchorEl: null,
            mobileMoreAnchorEl: null
        });

        const location = {
            pathname: '/ShoppingCart'
        };

        this.props.history.push(location);
    }

    buttonMyOrdersClick = () => {
        // this.setState({
        //     isSignInPopupOpened: false,
        //     anchorEl: null,
        //     mobileMoreAnchorEl: null
        // });

        // const location = {
        //     pathname: '/OrdersView'
        // };

        // this.props.history.push(location);
    }

    buttonMyAccountClick = () => {
        this.setState({
            isSignInPopupOpened: false,
            anchorEl: null,
            mobileMoreAnchorEl: null
        });

        const location = {
            pathname: '/AccountInformation'
        };

        this.props.history.push(location);
    }

    updateMenuLoggedIn = (isSucceeded: boolean, informationMessage: string, messageType: EnumMessageType) => {
        if (isSucceeded) {
            const url = '/api/User/GetUserTypeOfLoggedInUser';
            axios.get(url, {
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then((response: AxiosResponse) => {
                let userTypeResponse: EnumUserType = response.data;
                if (userTypeResponse === 0) {
                    isSucceeded = false;
                    userTypeResponse = EnumUserType[''];
                    informationMessage = 'User has successfully signed in but the user type cannot be reached at the moment. Please refresh the page and try again.';
                    messageType = EnumMessageType.Error;
                }

                this.setState({
                    loggedIn: isSucceeded,
                    userType: userTypeResponse,
                    isSignInSubmitted: true,
                    isSignInPopupOpened: isSucceeded
                });

                const location = {
                    pathname: '/',
                    state: {
                        informationMessage: informationMessage,
                        userType: userTypeResponse,
                        messageType: messageType,
                        isMessageShown: true,
                        isLoggedIn: isSucceeded,
                    }
                };
                this.props.history.push(location);
            });
        } else {
            this.setState({
                loggedIn: isSucceeded,
                isSignInSubmitted: true,
            });

            const location = {
                pathname: '/',
                state: {
                    informationMessage: informationMessage,
                    messageType: messageType,
                    isMessageShown: true,
                    isLoggedIn: isSucceeded,
                }
            };
            this.props.history.push(location);
        }

    };

    handleSignOut = () => {
        const url = `/api/Login/LogoutAsync`;

        axios.post(url).then((response: AxiosResponse) => {
            this.setState({
                loggedIn: false,
                isSignInPopupOpened: false,
                anchorEl: null,
                mobileMoreAnchorEl: null
            });

            const location = {
                pathname: '/',
                state: {
                    informationMessage: "Sign out has been made successfully.",
                    messageType: EnumMessageType.Success,
                    isMessageShown: true,
                    isLoggedIn: false
                }
            };
            this.props.history.push(location);
        });
    }

    returnToHomePageClick = () => {
        const location = {
            pathname: '/',
            state: {
                isLoggedIn: this.state.loggedIn,
                userType: this.state.userType,
                informationMessage: '',
                messageType: EnumMessageType.Error,
                isMessageShown: false
            }
        };
        this.props.history.push(location);
    }

    render() {
        const { anchorEl, mobileMoreAnchorEl, loggedIn, isSignInPopupOpened, fetchCompleted, userType } = this.state;
        const { classes } = this.props;
        const isMenuOpen = Boolean(anchorEl);
        const isMobileMenuOpen = Boolean(mobileMoreAnchorEl);

        const renderLoggedInMobileMenu = (
            <Menu
                anchorEl={mobileMoreAnchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMobileMenuOpen}
                onClose={this.handleMobileMenuClose}
            >
                <MenuItem>
                    <IconButton color="inherit">
                        <MailIcon />
                    </IconButton>
                    <p>Messages</p>
                </MenuItem>

                {userType === EnumUserType.Seller
                    ?
                    <MenuItem>
                        <IconButton color="inherit">
                            <NotificationsIcon />
                        </IconButton>
                        <p>Notifications</p>
                    </MenuItem>
                    :
                    <MenuItem onClick={this.buttonCartOpenClick}>
                        <IconButton color="inherit">
                            <Badge badgeContent={0} color="secondary">
                                <ShoppingCartIcon />
                            </Badge>
                        </IconButton>
                        <p>Cart</p>
                    </MenuItem>
                }

                <MenuItem onClick={this.handleProfileMenuOpen}>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <p>Profile</p>
                </MenuItem>
            </Menu>
        );

        const renderLoggedInDesktopMenu = (
            <div className={classes.sectionDesktop}>
                <IconButton className={classes.margin} color="inherit">
                    <MailIcon />
                </IconButton>
                {userType === EnumUserType.Seller
                    ?
                    <IconButton className={classes.margin} color="inherit">
                        <NotificationsIcon />
                    </IconButton>
                    :
                    <IconButton onClick={this.buttonCartOpenClick} className={classes.margin} color="inherit">
                        <Badge badgeContent={1} color="secondary">
                            <ShoppingCartIcon />
                        </Badge>
                    </IconButton>
                }
                <IconButton
                    aria-owns={isMenuOpen as Boolean ? 'material-appbar' : ''}
                    aria-haspopup="true"
                    onClick={this.handleProfileMenuOpen}
                    color="inherit"
                >
                    <AccountCircle />
                </IconButton>
            </div>
        );

        const renderNoLoggedInDesktopMenu = (
            <div className={classes.sectionDesktop}>
                <Grid container spacing={0}>

                    <Grid item xs={7}>
                        <Grid item xs={12}>
                            <Button
                                variant="outlined"
                                className={classes.buttonDesktop}
                                onClick={this.buttonSignInOnClick}
                            >
                                <LockOpen className={classNames(classes.rightIcon, classes.iconSmall)} />
                                LOGIN
                            </Button>
                        </Grid>
                        <Grid item xs={12} justify={"flex-start"} className={classes.grid}>
                            {isSignInPopupOpened ? <SignIn loggedIn={this.updateMenuLoggedIn} /> : ''}
                        </Grid>
                    </Grid>

                    <Grid item xs={5}>
                        <Button
                            variant="outlined"
                            className={classes.buttonDesktop}
                            onClick={() => this.buttonSignUpOnClick()}
                        >
                            <InputIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
                            SIGN UP
                        </Button>
                    </Grid>

                </Grid>

            </div>
        );

        const renderNoLoggedInMobileMenu = (
            <div>
                <Menu
                    anchorEl={mobileMoreAnchorEl}
                    anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                    transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                    open={isMobileMenuOpen}
                    onClose={this.handleMobileMenuClose}
                >
                    <MenuItem>
                        <Button
                            variant="outlined"
                            className={classes.buttonMobile}
                            onClick={() => this.buttonSignUpOnClick()}
                        >
                            <InputIcon className={classNames(classes.rightIcon, classes.iconSmall)} />
                            <p>SIGN UP</p>
                        </Button>
                    </MenuItem>
                    <MenuItem>
                        <Button
                            variant="outlined"
                            className={classes.buttonMobile}
                            onClick={this.buttonSignInOnClick}
                        >
                            <LockOpen className={classNames(classes.rightIcon, classes.iconSmall)} />
                            <p>LOGIN</p>
                        </Button>
                    </MenuItem>
                </Menu>
                <Grid item xs={12} justify={"center"} className={classes.signInGridMobile}>
                    {isSignInPopupOpened ? <SignIn loggedIn={this.updateMenuLoggedIn} /> : ''}
                </Grid>
            </div>
        );

        const renderAccountInformationMenu = (
            <Menu
                anchorEl={anchorEl}
                anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
                transformOrigin={{ vertical: 'top', horizontal: 'right' }}
                open={isMenuOpen}
                onClose={this.handleMenuClose}
            >
                <MenuItem onClick={() => this.buttonMyAccountClick()} style={{ paddingLeft: 2 }}>
                    <IconButton color="inherit">
                        <AccountCircle />
                    </IconButton>
                    <p>My Account</p>
                </MenuItem>

                {userType === EnumUserType.Seller
                    ?
                    <MenuItem onClick={() => this.buttonMyLibraryClick()} style={{ paddingLeft: 2 }}>
                        <IconButton color="inherit">
                            <BookIcon />
                        </IconButton>
                        <p>My Library</p>
                    </MenuItem>
                    :
                    <MenuItem onClick={() => this.buttonMyOrdersClick()} style={{ paddingLeft: 2 }}>
                        <IconButton color="inherit">
                            <ShopIcon />
                        </IconButton>
                        <p>My Orders</p>
                    </MenuItem>
                }

                <MenuItem onClick={this.handleSignOut} style={{ paddingLeft: 2 }}>
                    <IconButton color="inherit">
                        <Lock />
                    </IconButton>
                    <p>Logout</p>
                </MenuItem>
            </Menu>
        );

        return (
            fetchCompleted ? (
                <MuiThemeProvider theme={theme}>
                    <div className={classes.root}>
                        <AppBar position="static" color="primary">
                            <Toolbar>
                                <IconButton className={classes.menuButton} color="inherit" aria-label="Open drawer">
                                    <MenuIcon />
                                </IconButton>
                                <Typography
                                    onClick={() => this.returnToHomePageClick()}
                                    className={classes.title}
                                    variant="h6"
                                    color="inherit" noWrap
                                >
                                    Book Store
                            </Typography>
                                <SearchBar
                                    placeholder="Search..."
                                >
                                </SearchBar>
                                <div className={classes.grow} />

                                {loggedIn == false ? renderNoLoggedInDesktopMenu : renderLoggedInDesktopMenu}
                                <div className={classes.sectionMobile}>
                                    <IconButton
                                        color="inherit"
                                        aria-owns={isMobileMenuOpen ? 'menu-list-grow' : ''}
                                        aria-haspopup="true"
                                        onClick={this.handleMobileMenuOpen}
                                    >
                                        <MoreIcon />
                                    </IconButton>
                                    {loggedIn == false ? renderNoLoggedInMobileMenu : renderLoggedInMobileMenu}
                                </div>
                            </Toolbar>
                        </AppBar>
                        {renderAccountInformationMenu}
                    </div>
                </MuiThemeProvider >
            )
                : ''
        );
    }
}

export default withRouter(withStyles(styles)(MenuBar) as any) as any;