import { WithStyles, withStyles, Theme, Grid, TextField, Fab, Avatar } from "@material-ui/core"
import { RouterProps, withRouter } from "react-router";
import * as React from "react";
import { ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { EnumUserType } from "../enums/EnumUserType";
import { EnumMessageType } from "../enums/EnumMessageType";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Close';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
const noPersonImagePhoto = require('../resources/noPersonImage.jpg');

export interface PersonalInformationProps extends WithStyles<any>, RouterProps {
}

export interface PersonalInformationState {
    userName: string,
    firstName: string,
    lastName: string,
    identityNumber: Number,
    userType: EnumUserType,
    editModeOn: boolean
}

const styles = (theme: Theme) => ({
    root: {
        flexGrow: 1
    },
    paper: {
        marginTop: theme.spacing.unit * 2,
        display: 'flex',
        flexDirection: 'column'
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing.unit * 2
    },
    editButtonCss: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    },
    avatarPhoto: {
        width: theme.spacing.unit * 15,
        height: theme.spacing.unit * 15,
        marginBottom: theme.spacing.unit * 1,
    },
    avatarDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
} as Record<string, CSSProperties>);


class PersonalInformation extends React.Component<PersonalInformationProps, PersonalInformationState>{

    constructor(props: PersonalInformationProps) {
        super(props);

        this.state = {
            userName: "",
            firstName: "",
            lastName: "",
            identityNumber: 0,
            userType: undefined,
            editModeOn: false
        }
    }

    componentDidMount() {
        const url = '/api/User/GetPersonalInformation';
        axios.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse) => {
            const personalInformation = response.data;

            //Personal Information
            this.setState({
                firstName: personalInformation.firstName,
                lastName: personalInformation.lastName,
                userName: personalInformation.userName,
                identityNumber: personalInformation.identityNumber,
                userType: personalInformation.userType
            });
        });
    }

    handleUsernameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            userName: event.currentTarget.value
        });
    }

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

    handleUserTypeChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            userType: EnumUserType[event.currentTarget.value]
        });
    }

    handleIdentityNumberChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            identityNumber: Number(event.currentTarget.value)
        });
    }

    buttonSaveClick = () => {
        const url = `/api/User/SavePersonalInformation`;
        let isSucceeded = false;
        let messageType = EnumMessageType.Error;
        let informationMessage = "An error has occured.";
        let currentState = this.state;

        const personalInformationParams = {
            FirstName: currentState.firstName,
            LastName: currentState.lastName,
            UserName: currentState.userName,
            UserType: currentState.userType,
            IdentityNumber: currentState.identityNumber
        };

        axios.post(url, JSON.stringify(personalInformationParams), {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse<any>) => {
            const data = response.data;
            if (!data.IsSucceeded) {
                data.forEach((error: any) => {
                    informationMessage += error.ExceptionMessage + "\n";
                });

                isSucceeded = false;
                messageType = EnumMessageType.Error;
            }
            else {
                isSucceeded = true;
                messageType = EnumMessageType.Success;
                informationMessage = "The personal information were saved successfully.";
            }

            const location = {
                pathname: '/AccountInformation',
                state: {
                    informationMessage: informationMessage,
                    messageType: messageType,
                    isSuccessfullUpdate: isSucceeded,
                    willMessageShown: true
                }
            };
            this.props.history.push(location);
        });
    };

    buttonEditModeClick = () => {
        this.setState({
            editModeOn: true
        })
    };

    buttonEditModeCancelClick = () => {
        this.setState({
            editModeOn: false
        })
    };

    render() {
        const { classes } = this.props;
        const { firstName, userName, lastName, userType, identityNumber, editModeOn } = this.state;

        return (
            <div className={classes.paper}>

                <form className={classes.form} noValidate>
                    <Grid container className={classes.root} spacing={16}>

                        <Grid item xs={12} sm={4} />
                        <Grid item xs={12} sm={4}>
                            <div className={classes.avatarDiv}>
                                <Avatar alt="User Photo" src={noPersonImagePhoto} className={classes.avatarPhoto} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} />

                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="firstName"
                                variant="outlined"
                                disabled={!editModeOn}
                                fullWidth
                                name="firstName"
                                label="First Name"
                                id="firstName"
                                value={firstName}
                                onChange={this.handleFirstNameChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="lastName"
                                variant="outlined"
                                disabled={!editModeOn}
                                fullWidth
                                name="lastName"
                                label="Last Name"
                                id="lastName"
                                value={lastName}
                                onChange={this.handleLastNameChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="username"
                                variant="outlined"
                                disabled
                                fullWidth
                                name="username"
                                label="Username"
                                id="username"
                                value={userName}
                                onChange={this.handleUsernameChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="userType"
                                variant="outlined"
                                disabled
                                fullWidth
                                name="userType"
                                label="User Type"
                                id="userType"
                                value={userType ? EnumUserType[userType] : ''}
                                onChange={this.handleUserTypeChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="identityNumber"
                                variant="outlined"
                                disabled={!editModeOn}
                                fullWidth
                                name="identityNumber"
                                label="Identity Number"
                                id="identityNumber"
                                value={identityNumber === 0 ? "" : identityNumber.toString()}
                                onChange={this.handleIdentityNumberChange}
                            />
                        </Grid>

                        <Grid container>

                            <Grid item xs={12} sm={6} />
                            <Grid item xs={12} sm={6} >

                                <div className={classes.editButtonCss}>
                                    {editModeOn ?
                                        <Fab
                                            style={{ margin: '2px' }}
                                            color="secondary"
                                            aria-label="cancel"
                                            onClick={() => this.buttonEditModeCancelClick()}
                                        >
                                            <CancelIcon />
                                        </Fab>
                                        :
                                        <Fab
                                            style={{ margin: '2px' }}
                                            color="primary"
                                            aria-label="edit"
                                            onClick={() => this.buttonEditModeClick()}
                                        >
                                            <EditIcon />
                                        </Fab>
                                    }

                                    {editModeOn ?
                                        <Fab
                                            style={{ margin: '2px', fontWeight: 'bold' }}
                                            color="primary"
                                            disabled={!editModeOn}
                                            aria-label="save"
                                            variant="extended"
                                            onClick={() => this.buttonSaveClick()}
                                        >
                                            <SaveRoundedIcon className={classes.extendedIcon} />
                                            Save
                                    </Fab>
                                        :
                                        ''
                                    }

                                </div>
                            </Grid>

                        </Grid>

                    </Grid>

                </form>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(PersonalInformation) as any) as any;