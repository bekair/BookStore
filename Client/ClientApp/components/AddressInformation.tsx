import { WithStyles, withStyles, Theme, Grid, TextField, Fab, Avatar, FormControl, InputLabel, Select, MenuItem } from "@material-ui/core"
import { RouterProps, withRouter } from "react-router";
import * as React from "react";
import { ChangeEvent } from "react";
import axios, { AxiosResponse } from "axios";
import { CSSProperties } from "@material-ui/core/styles/withStyles";
import { EnumMessageType } from "../enums/EnumMessageType";
import EditIcon from '@material-ui/icons/Edit';
import CancelIcon from '@material-ui/icons/Close';
import SaveRoundedIcon from '@material-ui/icons/SaveRounded';
import { EnumAddressType } from "../enums/EnumAddressType";
const addressPhoto = require('../resources/addressInformation.jpg');

export interface AddressInformationProps extends WithStyles<any>, RouterProps {
}

export interface AddressInformationState {
    addressName: string,
    addressType: EnumAddressType,
    city: string,
    addresContent: string,
    postalCode: string,
    editModeOn: boolean
}

const addressTypes = Object.keys(EnumAddressType).filter((key) => isNaN(Number(key)));

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


class AddressInformation extends React.Component<AddressInformationProps, AddressInformationState>{

    constructor(props: AddressInformationProps) {
        super(props);

        this.state = {
            addressName: '',
            addressType: EnumAddressType[''],
            city: '',
            addresContent: '',
            postalCode: '',
            editModeOn: false
        }
    }

    componentDidMount() {
        const url = '/api/User/GetAddressInformation';
        axios.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse) => {
            const addressInformation = response.data;

            //Address Information
            this.setState({
                addressName: addressInformation.addressName,
                city: addressInformation.city,
                addresContent: addressInformation.addressContent,
                postalCode: addressInformation.postalCode,
                addressType: addressInformation.addressType === 0 ? EnumAddressType[''] : addressInformation.addressType
            });
        });
    }

    handleAddressNameChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            addressName: event.currentTarget.value
        });
    }

    handleCityChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            city: event.currentTarget.value
        });
    };

    handleAddressContentChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            addresContent: event.currentTarget.value
        });
    };

    handleAddressTypeChange = (event: ChangeEvent<{ value: string }>) => {
        this.setState({
            addressType: EnumAddressType[event.target.value]
        });
    };

    handlePostalCodeChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            postalCode: event.currentTarget.value
        });
    };

    buttonSaveClick = () => {
        const url = `/api/User/SaveAddressInformation`;
        let isSucceeded = false;
        let messageType = EnumMessageType.Error;
        let informationMessage = "An error has occured.";
        let currentState = this.state;

        const addressInformationParams = {
            AddressContent: currentState.addresContent,
            AddressName: currentState.addressName,
            AddressType: EnumAddressType[currentState.addressType],
            City: currentState.city,
            PostalCode: currentState.postalCode
        };

        axios.post(url, JSON.stringify(addressInformationParams), {
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
                informationMessage = "The address information were saved successfully.";
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
        const { addresContent, addressName, addressType, city, postalCode, editModeOn } = this.state;

        const renderAddressTypeCombobox = (
            <FormControl disabled={!editModeOn} fullWidth>
                <InputLabel shrink htmlFor="addressType-select">Address Type</InputLabel>
                <Select
                    id="addressType-select"
                    name="addressType-select"
                    value={EnumAddressType[addressType]}
                    defaultValue={EnumAddressType[addressType]}
                    required
                    onChange={this.handleAddressTypeChange}
                >
                    {/*<MenuItem value="">
                        <em>None</em>
                    </MenuItem>*/}
                    {
                        addressTypes.map(addressType => {
                            return <MenuItem value={EnumAddressType[addressType]}>{addressType}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        );

        return (
            <div className={classes.paper}>

                <form className={classes.form} noValidate>
                    <Grid container className={classes.root} spacing={16}>

                        <Grid item xs={12} sm={4} />
                        <Grid item xs={12} sm={4}>
                            <div className={classes.avatarDiv}>
                                <img alt="Address Photo" src={addressPhoto} className={classes.avatarPhoto} />
                            </div>
                        </Grid>
                        <Grid item xs={12} sm={4} />

                        <Grid item xs={12} sm={6}>
                            <TextField
                                autoComplete="addressName"
                                variant="outlined"
                                disabled={!editModeOn}
                                required
                                fullWidth
                                name="addressName"
                                label="Address Name"
                                id="addressName"
                                value={addressName}
                                onChange={this.handleAddressNameChange}
                            />
                        </Grid>

                        <Grid item xs={12} sm={6}>
                            {renderAddressTypeCombobox}
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="addressContent"
                                variant="outlined"
                                disabled={!editModeOn}
                                multiline
                                fullWidth
                                name="addressContent"
                                label="Address Content"
                                id="addressContent"
                                value={addresContent}
                                onChange={this.handleAddressContentChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="city"
                                variant="outlined"
                                disabled={!editModeOn}
                                required
                                fullWidth
                                name="city"
                                label="City"
                                id="city"
                                value={city}
                                onChange={this.handleCityChange}
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <TextField
                                autoComplete="postalCode"
                                variant="outlined"
                                disabled={!editModeOn}
                                fullWidth
                                name="postalCode"
                                label="Postal Code"
                                id="postalCode"
                                value={postalCode}
                                onChange={this.handlePostalCodeChange}
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

export default withRouter(withStyles(styles)(AddressInformation) as any) as any;