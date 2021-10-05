import { WithStyles, withStyles, Theme, Grid, TextField, Fab, Avatar, FormHelperText } from "@material-ui/core"
import { RouterProps, withRouter } from "react-router";
import * as React from "react";
import { ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { EnumMessageType } from "../enums/EnumMessageType";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Close';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
const contactInformationPhoto = require('../resources/contactInformation.png');

export interface ContactInformationProps extends WithStyles<any>, RouterProps {
}

export interface ContactInformationState {
    email: string,
    phoneNumber: string,
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
        marginBottom: theme.spacing.unit * 1
    },
    avatarDiv: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
    }
} as Record<string, CSSProperties>);


class ContactInformation extends React.Component<ContactInformationProps, ContactInformationState>{

    constructor(props: ContactInformationProps) {
        super(props);

        this.state = {
            email: "",
            phoneNumber: "",
            editModeOn: false
        }
    }

    componentDidMount() {
        const url = '/api/User/GetContactInformation';
        axios.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse) => {
            const contactInformation = response.data;

            //Contact Information
            this.setState({
                email: contactInformation.email,
                phoneNumber: contactInformation.phoneNumber
            });

            // //Address Information
            // addressInformation.addressContent = accountInformation.addressContent;
            // addressInformation.addressName = accountInformation.addressName;
            // addressInformation.addressType = accountInformation.addressType;
            // addressInformation.city = accountInformation.city;
            // addressInformation.postalCode = accountInformation.postalCode;
        });
    }

    handleEmailChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            email: event.currentTarget.value
        });
    }

    handlePhoneNumberChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            phoneNumber: event.currentTarget.value
        });
    };

    buttonSaveClick = () => {
        const url = `/api/User/SaveContactInformation`;
        let isSucceeded = false;
        let messageType = EnumMessageType.Error;
        let informationMessage = "An error has occured.";
        let currentState = this.state;

        const contactInformationParams = {
            Email: currentState.email,
            PhoneNumber: currentState.phoneNumber
        };

        axios.post(url, JSON.stringify(contactInformationParams), {
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
                informationMessage = "The contact information were saved successfully.";
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

    onKeyPressPhoneNumber = (event: any) => {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (!(/^\d+$/.test(keyValue))) {
            event.preventDefault();
        }
    };

    render() {
        const { classes } = this.props;
        const { email, phoneNumber, editModeOn } = this.state;

        return (
            <div className={classes.paper}>

                <form className={classes.form} noValidate>
                    <Grid container className={classes.root} spacing={16}>

                        <Grid item xs={12} sm={4} />
                        <Grid item xs={12} sm={4}>
                            <div className={classes.avatarDiv}>
                                <img alt="User Photo" src={contactInformationPhoto} className={classes.avatarPhoto} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} />

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="email"
                                variant="outlined"
                                disabled={!editModeOn}
                                fullWidth
                                name="email"
                                label="Email"
                                id="email"
                                value={email}
                                onChange={this.handleEmailChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="phoneNumber"
                                variant="outlined"
                                disabled={!editModeOn}
                                fullWidth
                                name="phoneNumber"
                                label="Phone Number"
                                id="phoneNumber"
                                value={phoneNumber}
                                onChange={this.handlePhoneNumberChange}
                                onKeyPress={this.onKeyPressPhoneNumber}
                            />
                            <FormHelperText error>You cannot enter any letter.</FormHelperText>
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

export default withRouter(withStyles(styles)(ContactInformation) as any) as any;