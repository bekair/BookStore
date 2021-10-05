import * as React from "react";
import { WithStyles, withStyles, Theme } from "@material-ui/core/styles";
import { EnumMessageType } from "../enums/EnumMessageType";
import { green, amber } from "@material-ui/core/colors";
import SnackbarContent from "@material-ui/core/SnackbarContent";
import CheckCircleIcon from '@material-ui/icons/CheckCircle';
import ErrorIcon from '@material-ui/icons/Error';
import InfoIcon from '@material-ui/icons/Info';
import CloseIcon from '@material-ui/icons/Close';
import WarningIcon from '@material-ui/icons/Warning';
import clsx from 'clsx';
import IconButton from '@material-ui/core/IconButton';
import { Snackbar } from "@material-ui/core";

export interface MessageBoxProps extends WithStyles<any> {
    classes: any,
    messageType: EnumMessageType,
    isOpened: boolean,
    onClose: any,
    autoHideDuration?: number
}

const messageIcon = {
    success: CheckCircleIcon,
    warning: WarningIcon,
    error: ErrorIcon,
    info: InfoIcon,
};

const styles = (theme: Theme) => ({
    root: {
        flexGrow: 1,
    },
    success: {
        backgroundColor: green[600],
    },
    error: {
        backgroundColor: theme.palette.error.dark,
    },
    info: {
        backgroundColor: theme.palette.primary.main,
    },
    warning: {
        backgroundColor: amber[700],
    },
    icon: {
        fontSize: 20,
    },
    iconVariant: {
        opacity: 0.9,
        marginRight: theme.spacing.unit * 1,
    },
    message: {
        display: 'flex',
        alignItems: 'center',
    },
    margin: {
        margin: theme.spacing.unit * 1
    },
});

class MessageBox extends React.Component<MessageBoxProps, {}>{

    constructor(props: MessageBoxProps) {
        super(props);
    }

    render() {
        const { children, classes, messageType, onClose, isOpened, autoHideDuration } = this.props;
        const Icon = messageIcon[messageType];

        return (
            <Snackbar
                open={isOpened}
                anchorOrigin={{
                    vertical: 'top',
                    horizontal: 'right',
                }}
                autoHideDuration={autoHideDuration || 6000}
                onClose={onClose}
            >
                <SnackbarContent
                    className={clsx(classes[messageType], classes.margin)}
                    aria-describedby="client-snackbar"
                    message={
                        <span id="client-snackbar" className={classes.message}>
                            <Icon className={clsx(classes.icon, classes.iconVariant)} />
                            {children}
                        </span>
                    }
                    action={[
                        <IconButton key="close" aria-label="Close" color="inherit" onClick={onClose}>
                            <CloseIcon className={classes.icon} />
                        </IconButton>
                    ]}
                />
            </Snackbar>
        );
    }
}

export default withStyles(styles)(MessageBox);