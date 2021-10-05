import * as React from 'react';
import { WithStyles, Theme, withStyles, Typography, AppBar, Tabs, Tab, Paper, Grid } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { withRouter, RouterProps } from "react-router";
import PhoneIcon from '@material-ui/icons/Phone';
import PersonPinIcon from '@material-ui/icons/PersonPin';
import HomeIcon from '@material-ui/icons/Home';
import { EnumMessageType } from '../enums/EnumMessageType';
import * as H from 'history';
import PersonalInformation from './PersonalInformation';
import ContactInformation from './ContactInformation';
import MessageBox from './MessageBox';
import AddressInformation from './AddressInformation';

export interface AccountInformationProps extends WithStyles<any>, RouterProps {
    location: H.Location
}

export interface AccountInformationState {
    value: any,
    willMessageShown: boolean
}

interface TabPanelProps {
    children?: React.ReactNode;
    index: any;
    value: any;
    tabPanelCss: string;
}

const TabPanel = (props: TabPanelProps) => {
    const { children, value, index, tabPanelCss, ...other } = props;

    return (
        <Typography
            component="div"
            role="tabpanel"
            hidden={value !== index}
            id={`vertical-tabpanel-${index}`}
            aria-labelledby={`vertical-tab-${index}`}
            {...other}
        >
            {value === index &&
                <Paper className={tabPanelCss} elevation={0}>
                    {children}
                </Paper>
            }
        </Typography>
    );
};

const a11yProps = (index: any) => {
    return {
        id: `scrollable-force-tab-${index}`,
        'aria-controls': `scrollable-force-tabpanel-${index}`,
    };
}

const styles = (theme: Theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 1200,
        minHeight: 800,
        marginTop: '2%',
        marginLeft: '25%',
        marginRight: '25%',
        [theme.breakpoints.down('sm') as string]: {
            marginRight: '15%',
            marginLeft: '10%'
        },
        [theme.breakpoints.down('xs') as string]: {
            marginRight: '3%',
            marginLeft: '3%'
        }
    },
    tabPanelCss: {
        padding: theme.spacing.unit * 1,
        height: '600px'
    },
    tabCss: {
        fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
        fontWeight: 'bold',
        fontSize: '1em',
        marginRight: '3%'
    }
} as Record<string, CSSProperties>);

const contactInformation = {
    phoneNumber: "",
    email: ""
}

const addressInformation = {
    addressName: "",
    addressType: undefined,
    addressContent: "",
    city: "",
    postalCode: ""
}


class AccountInformation extends React.Component<AccountInformationProps, AccountInformationState>{

    constructor(props: AccountInformationProps) {
        super(props);
        this.state = {
            value: 0,
            willMessageShown: (this.props.location.state !== undefined) ? (this.props.location.state.isMessageShown) : false
        };
    }

    handleMessageBoxClose = () => {
        this.props.location.state.willMessageShown = false;

        this.setState({
            willMessageShown: this.props.location.state.willMessageShown
        });
    }

    componentCleanup = () => {
        if (this.props.location.state != undefined) {

            //In order to delete the message from the screen when the page is refreshed.
            this.props.history.replace({
                state: undefined
            });
        }
    }

    componentDidMount() {
        window.addEventListener('beforeunload', this.componentCleanup);
    }

    componentWillUnmount() {
        this.componentCleanup();
        // remove the event handler for normal unmounting
        window.removeEventListener('beforeunload', this.componentCleanup);
    }

    renderSnackbar = () => {
        if (this.props.location.state != undefined) {
            return (
                <Grid container justify={"flex-end"} className={"{root:{flexGrow:1}}"}>
                    <MessageBox
                        messageType={this.props.location.state.isSuccessfullUpdate ? EnumMessageType.Success : EnumMessageType.Error}
                        isOpened={this.props.location.state.willMessageShown}
                        onClose={this.handleMessageBoxClose}
                    >
                        {this.props.location.state.informationMessage}
                    </MessageBox >
                </Grid>
            );
        }
        else {
            return '';
        }
    };


    render() {
        const { classes } = this.props;
        const { value } = this.state;

        const handleChange = (event: React.ChangeEvent<{}>, newValue: number) => {
            this.setState({
                value: newValue
            });
        };

        return (
            <div>
                {this.renderSnackbar()}
                <Paper square
                    className={classes.root}
                    elevation={0}
                >
                    <Tabs
                        value={value}
                        onChange={(event, value) => handleChange(event, value)}
                        variant="fullWidth"
                        scrollButtons="on"
                        indicatorColor="primary"
                        textColor="primary"
                        aria-label="scrollable force tabs book store"
                    >
                        <Tab className={classes.tabCss} label="Personal Information" icon={<PersonPinIcon fontSize={"large"} />} {...a11yProps(0)} />
                        <Tab className={classes.tabCss} label="Contact Information" icon={<PhoneIcon fontSize={"large"} />} {...a11yProps(1)} />
                        <Tab className={classes.tabCss} label="Address" icon={<HomeIcon fontSize={"large"} />} {...a11yProps(2)} />
                    </Tabs>

                    <TabPanel
                        tabPanelCss={classes.tabPanelCss}
                        value={value}
                        index={0}
                    >
                        <PersonalInformation />
                    </TabPanel>

                    <TabPanel
                        tabPanelCss={classes.tabPanelCss}
                        value={value}
                        index={1}
                    >
                        <ContactInformation />
                    </TabPanel>

                    <TabPanel
                        tabPanelCss={classes.tabPanelCss}
                        value={value}
                        index={2}>
                        <AddressInformation />
                    </TabPanel>
                </Paper>
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(AccountInformation) as any) as any;