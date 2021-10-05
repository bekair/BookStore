import * as React from 'react';
import { WithStyles, Theme, withStyles, Typography, Paper, Grid, CircularProgress, Fab, Button } from '@material-ui/core';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { withRouter, RouterProps } from "react-router";
import { EnumMessageType } from '../enums/EnumMessageType';
import * as H from 'history';
import MessageBox from './MessageBox';
import IconButton from '@material-ui/core/IconButton';
import RemoveShoppingCartIcon from '@material-ui/icons/RemoveShoppingCart';
import DeleteIcon from '@material-ui/icons/Delete';
import AddIcon from '@material-ui/icons/Add';
import RemoveIcon from '@material-ui/icons/Remove';
import LocalShippingIcon from '@material-ui/icons/LocalShipping';
import InfoIcon from '@material-ui/icons/Info';
import PaymentIcon from '@material-ui/icons/Payment';
import Divider from '@material-ui/core/Divider';
import clsx from 'clsx';
import axios, { AxiosResponse } from 'axios';
const noImageFoundPhoto = require('../resources/noImageFound.jpg');
const visa = require('../resources/visa.png');
const masterCard = require('../resources/masterCard.jpg');
const paypal = require('../resources/paypal.svg');
const americanExpress = require('../resources/amex.png');


export interface ShoppingCartProps extends WithStyles<any>, RouterProps {
    location: H.Location
}

export interface ShoppingCartState {
    willMessageShown: boolean,
    informationMessage: string,
    isSuccessfullUpdate: boolean,
    fetchCompleted: boolean,
    cartItems: any[],
    subTotal: any
}

const styles = (theme: Theme) => ({
    root: {
        flexGrow: 1,
        maxWidth: 1200,
        minHeight: 800,
        marginTop: '1%',
        marginLeft: '20%',
        marginRight: '20%',
        [theme.breakpoints.down('sm') as string]: {
            marginRight: '10%',
            marginLeft: '10%'
        },
        [theme.breakpoints.down('xs') as string]: {
            marginRight: '3%',
            marginLeft: '3%'
        }
    },
    header: {
        fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
        color: '#3f51b5',
        textAlign: 'left',
        fontWeight: 'bold'
    },
    containerEmptyCart: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        paddingTop: '20%',
        [theme.breakpoints.down('sm') as string]: {
            paddingTop: '30%'
        }
    },
    containerCartContent: {
        padding: theme.spacing.unit * 2
    },
    gridIcon: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    emptyCartTypo: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: '2%'
    },
    fabIcon: {
        width: '150px',
        height: '150px',
        backgroundColor: '#3f51b5',
        color: 'white'
    },
    fabAddIcon: {
        width: '33px',
        height: '1px',
        backgroundColor: '#3f51b5',
        color: 'white'
    },
    fabRemoveIcon: {
        width: '33px',
        height: '1px'
    },
    paperCartItem: {
        maxHeight: '200px',
        height: '200px',
        marginTop: '5px',
        padding: `${theme.spacing.unit * 2}px ${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px ${theme.spacing.unit * 1}px`
    },
    paperCartOrder: {
        marginLeft: '10px',
        [theme.breakpoints.down('xs') as string]: {
            marginTop: '10px',
            marginLeft: '0px'
        },
        minHeight: '500px'
    },
    paperDeliveryOption: {
        minHeight: '150px',
        marginTop: '10px',
        fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
        backgroundColor: '#3f51b5',
        color: 'white'
    },
    orderTotalContentHeader: {
        fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
        color: 'black'
    },
    spanQuantity: {
        marginRight: '40px'
    },
    gridDeliveryIcon: {
        paddingTop: '40px',
        [theme.breakpoints.down('xs') as string]: {
            paddingTopTop: '25px'
        }
    },
    shippingIconStyle: {
        color: 'white',
        backgroundColor: '#3f51b5',
        width: '50px',
        height: '50px'
    },
    gridDeliveryOption: {
        display: 'flex',
        padding: '0 16px 16px 40px'
    },
    freeDeliveryText: {
        fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
        fontWeight: 'bold',
        color: 'white'
    },
    gridDeliveryText: {
        marginTop: '25px'
    },
    buttonCheckout: {
        margin: `${theme.spacing.unit * 8}px 0 ${theme.spacing.unit * 1}px 0`,
        fontWeight: 'bold',
        color: '#fff',
        backgroundColor: '#66bb6a',
        height: '50px'
    }
} as Record<string, CSSProperties>);

class ShoppingCart extends React.Component<ShoppingCartProps, ShoppingCartState>{

    constructor(props: ShoppingCartProps) {
        super(props);
        console.log('SHOPPING CART CONSTRUCTOR');
        this.state = {
            willMessageShown: false,
            informationMessage: '',
            isSuccessfullUpdate: false,
            fetchCompleted: false,
            cartItems: [],
            subTotal: 0
        };
    }

    handleMessageBoxClose = () => {
        this.setState({
            willMessageShown: false
        });
    }

    componentDidMount() {
        const url = '/api/BuyProcess/GetShoppingCartItems';

        axios.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse) => {
            const receivedCartItems = response.data;
            let subTotal = 0;

            receivedCartItems.forEach(cartItem => {
                subTotal += cartItem.quantity * cartItem.bookForSale.price
            });

            this.setState({
                cartItems: receivedCartItems,
                fetchCompleted: true,
                subTotal: subTotal
            });
        });
    }

    renderSnackbar = () => {
        if (this.state.willMessageShown) {
            const { isSuccessfullUpdate, willMessageShown, informationMessage } = this.state;
            return (
                <Grid container justify={"flex-end"} className={"{root:{flexGrow:1}}"}>
                    <MessageBox
                        messageType={isSuccessfullUpdate ? EnumMessageType.Success : EnumMessageType.Error}
                        isOpened={willMessageShown}
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
    };

    buttonDeliveryInfoClick = () => {

    }

    buttonCheckoutClick = () => {

    }


    render() {
        const { classes } = this.props;
        const { fetchCompleted, cartItems, subTotal } = this.state;

        const renderLoading = (
            <Grid container style={{ marginTop: '30%', display: 'flex' }} justify="center" alignItems="center">
                <CircularProgress disableShrink />
            </Grid>
        );

        const renderEmptyCart = (
            <Grid container className={classes.containerEmptyCart}>

                <Grid item xs={12} sm={4} />
                <Grid item xs={12} sm={4} className={classes.gridIcon}>
                    <Fab className={classes.fabIcon}>
                        <RemoveShoppingCartIcon style={{ width: '3em', height: '3em' }} />
                    </Fab>
                </Grid>
                <Grid item xs={12} sm={4} />

                <Grid item xs={12} sm={4} />
                <Grid item xs={12} sm={4} className={classes.emptyCartTypo}>
                    <Typography style={{ fontWeight: 'bold' }} variant='h6'>
                        Cart is empty now...
                    </Typography>
                </Grid>
                <Grid item xs={12} sm={4} />

            </Grid>
        );

        const renderDeliveryOptions = (
            <Paper elevation={3} className={classes.paperDeliveryOption}>
                <Grid container className={classes.gridDeliveryOption} justify='center' alignItems='center'>
                    <Grid item xs={12} sm={3} className={classes.gridDeliveryIcon}>
                        <LocalShippingIcon className={classes.shippingIconStyle} />
                    </Grid>
                    <Grid item xs={12} sm={9} className={classes.gridDeliveryText}>
                        <div style={{ marginLeft: '20px' }}>
                            <h2 className={classes.freeDeliveryText}>Free Delivery Post</h2>
                        </div>
                        <div>
                            <h5>The only option to receive your deliveries for now...</h5>
                        </div>
                    </Grid>
                </Grid>
            </Paper>
        );

        const renderCartItemList = (
            <Paper elevation={3}>
                {cartItems.length !== 0 && cartItems.map((cartItem: any, index) => {
                    const isPhotoValid = btoa(atob(cartItem.bookForSale.book.bookDetail.coverPhoto)) === cartItem.bookForSale.book.bookDetail.coverPhoto;
                    return (
                        <Paper key={index} className={classes.paperCartItem} elevation={0}>
                            <Grid container>
                                <Grid item xs={3} sm={2} style={{ width: '100px', height: '200px' }}>
                                    <img src={isPhotoValid ? `data:image/jpeg;base64,${cartItem.bookForSale.book.bookDetail.coverPhoto}` : noImageFoundPhoto}
                                        width='100%'
                                        height='100%'
                                    />
                                </Grid>
                                <Grid item xs={1} sm={1}></Grid>
                                <Grid item xs={8} sm={9}>
                                    <Grid container alignItems='center'>
                                        <Grid item xs={8} sm={10} style={{ marginTop: '20px', fontWeight: 'bold' }}>
                                            {cartItem.bookForSale.book.title}
                                        </Grid>
                                        <Grid item xs={4} sm={2} style={{ display: 'flex', justifyContent: 'center', marginTop: '10px' }}>
                                            <IconButton aria-label="delete">
                                                <DeleteIcon />
                                            </IconButton>
                                        </Grid>

                                        <Grid item xs={12}>
                                            <div className={classes.header}>
                                                <p style={{ marginTop: '10px', color: 'black' }}>
                                                    {cartItem.bookForSale.book.bookAuthors.map((bookAuthor: any) => bookAuthor.author.authorName).join()}
                                                </p>
                                            </div>
                                        </Grid>

                                        <Grid item xs={9} sm={10} style={{ display: 'flex' }}>
                                            <Grid container>
                                                <Grid item xs={2}>
                                                    <p style={{ marginTop: '10px', color: 'black' }}>
                                                        Quantity
                                                    </p>
                                                </Grid>
                                                <Grid item xs={1}></Grid>
                                                <Grid item xs={1}>
                                                    <Fab className={classes.fabAddIcon} aria-label="add">
                                                        <AddIcon style={{ width: '20px', height: '20px', fontWeight: 'bold' }} />
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={2} justify='center' alignItems='center' style={{ display: 'flex' }}>
                                                    <p style={{ marginTop: '10px', color: 'black' }}>
                                                        {cartItem.quantity}
                                                    </p>
                                                </Grid>
                                                <Grid item xs={1}>
                                                    <Fab className={classes.fabRemoveIcon} aria-label="add">
                                                        <RemoveIcon style={{ width: '20px', height: '20px', fontWeight: 'bold' }} />
                                                    </Fab>
                                                </Grid>
                                                <Grid item xs={5}></Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item xs={3} sm={2}>
                                            <div className={classes.header}>
                                                <h3 style={{ marginTop: '10px', display: 'flex', justifyContent: 'center' }}>
                                                    {cartItem.quantity * cartItem.bookForSale.price}
                                                </h3>
                                            </div>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>
                        </Paper>
                    )
                })}
            </Paper >
        )

        const renderOrderTotalGrid = (
            <Paper className={clsx(classes.paperCartItem, classes.paperCartOrder)} elevation={3}>
                <Grid container style={{ paddingLeft: '16px', paddingRight: '24px' }}>
                    <Grid item xs={12}>
                        <div className={classes.header}>
                            <h1>TOTAL</h1>
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <Divider style={{ marginBottom: '10px' }} variant="middle" />
                    </Grid>

                    <Grid item xs={6}>
                        <div className={classes.orderTotalContentHeader}>
                            <h3>Sub Total</h3>
                        </div>
                    </Grid>
                    <Grid item xs={6} style={{ display: 'flex' }} justify='flex-end' alignItems='flex-end' >
                        <div className={classes.header}>
                            <h3>{subTotal}</h3>
                        </div>
                    </Grid>

                    <Grid item xs={6}>
                        <div className={classes.orderTotalContentHeader}>
                            <h3>Delivery</h3>
                        </div>
                    </Grid>
                    <Grid item xs={6} style={{ display: 'flex' }} justify='flex-end' alignItems='center' >
                        <InfoIcon onClick={this.buttonDeliveryInfoClick}
                            style={{ borderColor: '#e8e8e8', color: '#e8e8e8', backgroundColor: '#fff' }}
                        />
                    </Grid>

                    <Grid item xs={12}>
                        <Divider variant="middle" />
                    </Grid>

                    <Grid item xs={12} alignItems='center' justify='center'>
                        <Button
                            variant="contained"
                            className={classes.buttonCheckout}
                            onClick={this.buttonCheckoutClick}
                            fullWidth
                        >
                            <PaymentIcon style={{ marginRight: '10px' }} />
                            <span>CHECKOUT</span>
                        </Button>
                    </Grid>

                    <Grid item xs={12}>
                        <div className={classes.orderTotalContentHeader}>
                            <h3>WE ACCEPT:</h3>
                        </div>
                    </Grid>

                    <Grid item xs={12}>
                        <span style={{ marginRight: '4px' }}>
                            <img width='50px' height='45px' src={visa}></img>
                        </span>
                        <span style={{ marginRight: '4px' }}>
                            <img width='50px' height='45px' src={masterCard}></img>
                        </span>
                        <span style={{ marginRight: '4px' }}>
                            <img width='50px' height='45px' src={americanExpress}></img>
                        </span>
                        <span style={{ marginRight: '4px' }}>
                            <img width='50px' height='45px' src={paypal}></img>
                        </span>
                    </Grid>

                </Grid>
            </Paper >
        )

        const renderCartContent = (
            <Grid container className={classes.containerCartContent}>
                <Grid item xs={6}>
                    <div className={classes.header}>
                        <h1>MY SHOPPING BAG</h1>
                    </div>
                </Grid>
                <Grid item xs={6} justify='flex-end' alignItems='flex-end' style={{ display: 'flex' }}>
                    <div>
                        <h5>Items are reserved for you.</h5>
                    </div>
                </Grid>

                <Grid item xs={12}>
                    <Divider style={{ marginBottom: '20px' }} variant="fullWidth" />
                </Grid>

                <Grid container>
                    <Grid item xs={12} sm={8}>
                        {renderCartItemList}
                        {renderDeliveryOptions}
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        {renderOrderTotalGrid}
                    </Grid>
                </Grid>
            </Grid>
        );

        return (
            <div>
                {this.renderSnackbar()}
                {fetchCompleted
                    ?
                    (
                        <Paper square className={classes.root} elevation={0}>
                            {(cartItems && cartItems.length !== 0)
                                ?
                                renderCartContent
                                :
                                renderEmptyCart
                            }
                        </Paper>
                    )
                    :
                    renderLoading
                }
            </div>
        )
    }
}

export default withRouter(withStyles(styles)(ShoppingCart) as any) as any;