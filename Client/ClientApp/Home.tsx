import * as React from 'react';
import BookList from './containers/BookList';
import { Grid, WithStyles, CircularProgress } from '@material-ui/core';
import MessageBox from './components/MessageBox';
import * as H from 'history';
import { RouterProps, withRouter } from 'react-router';
import { EnumUserType } from './enums/EnumUserType';
import ForSaleBooks from './components/ForSaleBooks';

export interface HomeProps extends WithStyles<any>, RouterProps {
    location: H.Location
}

export interface HomeState {
    willMessageShown: boolean,
}

class Home extends React.Component<HomeProps, HomeState> {
    constructor(props: HomeProps) {
        super(props);

        this.state = {
            willMessageShown: (this.props.location.state !== undefined) ? (this.props.location.state.isMessageShown) : false,
        };
    }

    handleMessageBoxClose = () => {
        this.props.location.state.isMessageShown = false;

        this.setState({
            willMessageShown: this.props.location.state.isMessageShown
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
    };


    componentWillUnmount() {
        // this.componentCleanup();
        // remove the event handler for normal unmounting
        window.removeEventListener('beforeunload', this.componentCleanup);

    }

    renderHomePageContent = () => {
        const isLoggedIn = this.props.location.state && this.props.location.state.isLoggedIn;

        if (isLoggedIn === undefined) {
            return (
                <Grid style={{ marginTop: '30%' }} container>
                    <Grid item sm={12}>
                        <Grid container justify="center" alignItems="center">
                            <CircularProgress disableShrink />
                        </Grid>
                    </Grid>
                </Grid>
            )
        }

        const url = "/api/Book/fetch?criteria=3&searchkey=sherlock";
        if (isLoggedIn) {
            if (this.props.location.state.userType === EnumUserType.Buyer) {
                return <ForSaleBooks></ForSaleBooks>
            }
            else {
                //If user is seller, it will show random googleBookApi books
                return <BookList fetchUrl={url}></BookList>
            }
        }
        else {
            //If there is no loggedIn user, it will show random googleBookApi books
            return (
                <BookList fetchUrl={url}></BookList>
            );
        }
    }

    renderSnackbar = () => {
        if (this.props.location.state != undefined) {
            return (
                <Grid container justify={"flex-end"} className={"{root:{flexGrow:1}}"}>
                    <MessageBox
                        messageType={this.props.location.state.messageType}
                        isOpened={this.props.location.state.isMessageShown}
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
    }


    public render() {
        return (
            <div>
                {this.renderSnackbar()}
                {this.renderHomePageContent()}
            </div >

        );
    }

}

export default withRouter(Home as any) as any;;