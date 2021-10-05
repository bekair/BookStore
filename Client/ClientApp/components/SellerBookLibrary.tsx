import * as React from 'react';
import { WithStyles, withStyles } from '@material-ui/core/styles';
import { RouterProps, withRouter } from 'react-router';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import styled from 'styled-components'
import * as H from 'history';
import { Grid, Fab, Theme, Paper, CircularProgress, FormControl, InputLabel, Input, InputAdornment, TextField, OutlinedInput } from '@material-ui/core';
import axios, { AxiosResponse } from 'axios';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import AddIcon from '@material-ui/icons/Add';
import EditIcon from '@material-ui/icons/Edit';
import EditAttributesIcon from '@material-ui/icons/EditAttributes';
import DoneIcon from '@material-ui/icons/Done';
import ImportExportIcon from '@material-ui/icons/ImportExport';
import { getMeaningfullStrings } from '../enums/EnumSaleStatus';
import { EnumMessageType } from '../enums/EnumMessageType';
import MessageBox from './MessageBox';
const noBooksFoundImage = require('../resources/noBooksFound.jpg');
const noImageFoundPhoto = require('../resources/noImageFound.jpg');

export interface SellerBookLibraryProps extends WithStyles<any>, RouterProps {
    classes: any,
    location: H.Location
}

export interface SellerBookLibraryState {
    bookList: any[],
    fetchCompleted: boolean,
    priceList: any[],
    editModes: boolean[],
    acceptButtonsVisibility: boolean[],
    isSuccessfullUpdate: boolean,
    willMessageShown: boolean,
    informationMessage: string
}

const StyledTh = styled.th({
    backgroundColor: '#3f51b5',
    textAlign: 'center' as any,
    color: 'white',
    padding: '2%'
});

const StyledTd = styled.td`
    padding: 15px;
    text-align: center;
    border-bottom: 1px solid gray;
`;

const StyledTable = styled.table`
    width:100%;
    margin-bottom:5%;
    border-spacing: 0;
    margin-top:10px;
    font-weight:bold;
`;

const styles = (theme: Theme) => ({
    root: {
        width: '100%',
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },
    extendedIcon: {
        marginRight: theme.spacing.unit * 1
    },
    card: {
        maxWidth: 575,
        border: '0px'
    },
    paper: {
        padding: theme.spacing.unit * 2,
        textAlign: 'center',
        color: theme.palette.text.secondary
    },
    table: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 1,
        width: '80%',
        minHeight: '700px',
        overflowX: 'auto'
    },
    header: {
        fontFamily: '"Trebuchet MS", Helvetica, sans-serif',
        color: '#3f51b5',
        textAlign: 'left',
        fontWeight: 'bold'
    },
    filledPaper: {
        textAlign: 'left',
        color: theme.palette.text.secondary
    },
    editRowCss: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end'
    }
} as Record<string, CSSProperties>);


class SellerBookLibrary extends React.Component<SellerBookLibraryProps, SellerBookLibraryState> {

    constructor(props: SellerBookLibraryProps) {
        super(props);
        this.state = {
            bookList: [],
            fetchCompleted: false,
            priceList: [],
            editModes: [],
            acceptButtonsVisibility: [],
            informationMessage: '',
            isSuccessfullUpdate: false,
            willMessageShown: false
        };
    }

    componentDidMount() {
        const url = '/api/Book/GetAllBooks';
        axios.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        }).then((response: AxiosResponse) => {
            const bookList = response.data;
            let priceList = [];
            let editModes = [];
            let acceptButtonsVisibility = [];
            if (bookList && bookList.length !== 0) {
                priceList = bookList.map((bookForSale: any) => bookForSale.price || 0);
                editModes = Array(bookList.length).fill(false) as boolean[];
                acceptButtonsVisibility = Array(bookList.length).fill(false) as boolean[];
            }

            this.setState({
                bookList: bookList || [],
                priceList: priceList || [],
                fetchCompleted: true,
                editModes: editModes || [],
                acceptButtonsVisibility: acceptButtonsVisibility
            });
        });
    }

    handleEditClick = (bookId: any) => {
        console.log('edit: ' + bookId)
    }

    handleSellClick = (event: any) => {
        const index = Number(event.currentTarget.parentNode.getAttribute("data-key"));
        const { acceptButtonsVisibility, editModes } = this.state;
        event.currentTarget.parentNode.getAttribute("data-key")
        acceptButtonsVisibility[index] = true;
        editModes[index] = true;

        this.setState({
            acceptButtonsVisibility: acceptButtonsVisibility,
            editModes: editModes
        })
    }

    handeAddNewBookClick = () => {
        const location = {
            pathname: '/BookAdd',
        };

        this.props.history.push(location);
    }

    handlePriceChange = (event: any, index: any) => {
        this.state.priceList[index] = event.target.value;
        this.setState({
            priceList: this.state.priceList
        });
    }

    handleAcceptClick = (bookForSaleId: any, index: any) => {
        const url = '/api/User/PutBookForSale'
        const price = this.state.priceList[index];
        const { bookList, acceptButtonsVisibility, editModes } = this.state;
        const bookForSaleModel = {
            bookForSaleId: bookForSaleId,
            price: price
        };
        let willMessageShown = true;

        if (price === "" || price === 0) {
            this.setState({
                willMessageShown: willMessageShown,
                isSuccessfullUpdate: false,
                informationMessage: `\'${bookList[index].book.title}\' book which you want to sell, should have a value different from \'0\'`
            })
        } else {
            axios.post(url, JSON.stringify(bookForSaleModel), {
                headers: {
                    "Content-Type": "application/json; charset=utf-8"
                }
            }).then((response: AxiosResponse) => {
                const data = response.data;
                if (data.isSucceeded) {
                    bookList[index].saleStatus = data.saleStatus;
                    editModes[index] = false;
                    acceptButtonsVisibility[index] = false;

                    this.setState({
                        willMessageShown: willMessageShown,
                        isSuccessfullUpdate: true,
                        informationMessage: `\'${bookList[index].book.title}\' book has been put up for sale successfully.`,
                        bookList: bookList,
                        editModes: editModes,
                        acceptButtonsVisibility: acceptButtonsVisibility
                    })
                }
                else {
                    this.setState({
                        willMessageShown: true,
                        isSuccessfullUpdate: false,
                        informationMessage: data.errorList[0].exceptionMessage
                    })
                }
            });
        }
    }

    onKeyPressPrice = (event: any) => {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (!(/^\d+$/.test(keyValue))) {
            event.preventDefault();
        }
    };

    handleMessageBoxClose = () => {
        this.setState({
            willMessageShown: false
        });
    }

    renderSnackbar = () => {
        const { willMessageShown, isSuccessfullUpdate, informationMessage } = this.state;
        if (willMessageShown) {
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

    render() {
        const { classes } = this.props;
        const { bookList, fetchCompleted, editModes, acceptButtonsVisibility, priceList } = this.state;

        const renderLoading = () => {
            <Grid container style={{ marginTop: '30%' }} justify="center" alignItems="center">
                <Grid item sm={12}>
                    <CircularProgress disableShrink />
                </Grid>
            </Grid>
        }

        const renderAddNewBookButton = (classCSS: string) => (
            <Paper elevation={0} className={classCSS}>
                <Fab
                    color="primary"
                    aria-label="add"
                    variant="extended"
                    style={{ fontWeight: 'bold' }}
                    onClick={() => this.handeAddNewBookClick()}
                >
                    <AddIcon className={classes.extendedIcon} />
                    Add New Book
                </Fab>
            </Paper>
        );

        const renderEmptyBookPage = (
            <Grid
                container
                spacing={24}
                alignContent='center'
                justify='center'
                direction='column'
                style={{ marginTop: '5%' }}
            >
                <Grid item xs={12}>
                    <Card elevation={0} className={classes.card}>
                        <CardMedia>
                            <img src={noBooksFoundImage} />
                        </CardMedia>
                    </Card>
                </Grid>

                <Grid item xs={12}>
                    {renderAddNewBookButton(classes.paper)}
                </Grid>
            </Grid>
        );

        const renderEdit = (bookForSale: any, index: any) => {
            return (
                <div data-key={index} className={classes.editRowCss}>
                    <Fab
                        style={{
                            margin: '3px', fontWeight: 'bold',
                            color: editModes[index] ? '' : '#fff', backgroundColor: '#66bb6a'
                        }}
                        aria-label="sell"
                        disabled={editModes[index]}
                        variant="extended"
                        onClick={this.handleSellClick}
                    >
                        <ImportExportIcon className={classes.extendedIcon} />
                        Sell
                    </Fab>
                    <Fab
                        style={{ margin: '3px', fontWeight: 'bold', color: '#3f51b5' }}
                        aria-label="edit"
                        variant="extended"
                        onClick={() => this.handleEditClick(bookForSale.book.id)}
                    >
                        <EditIcon className={classes.extendedIcon} />
                        Edit
                    </Fab>
                </div>
            )
        };

        const renderCoverPhoto = (bookForSale: any) => {
            const isPhotoValid = btoa(atob(bookForSale.book.bookDetail.coverPhoto)) === bookForSale.book.bookDetail.coverPhoto;
            return (
                <img
                    src={isPhotoValid ? `data:image/jpeg;base64,${bookForSale.book.bookDetail.coverPhoto}` : noImageFoundPhoto}
                    style={{ maxHeight: '120px', maxWidth: '120px' }}
                />
            )
        };

        const renderPutForSale = (index: any) => {
            return (
                <Grid container justify="center" alignItems="center">
                    <Grid item xs={12}>
                        <FormControl fullWidth className={classes.margin} variant='outlined'>
                            <InputLabel htmlFor="price">Price</InputLabel>
                            <OutlinedInput
                                id='price'
                                value={priceList[index]}
                                disabled={!this.state.editModes[index]}
                                // onKeyPress={this.onKeyPressPrice}
                                onChange={() => this.handlePriceChange(event, index)}
                                startAdornment={<InputAdornment position='start'>₺</InputAdornment>}
                                labelWidth={60}
                            />
                        </FormControl>
                    </Grid>
                </Grid>
            )
        };

        const renderAcceptButton = (index: any, bookForSaleId: any) => {
            return (
                <div className={classes.editRowCss}>
                    <Fab
                        style={{
                            margin: '3px', fontWeight: 'bold', color: '#fff',
                            backgroundColor: '#66bb6a', visibility: acceptButtonsVisibility[index] ? 'visible' : 'hidden'
                        }}
                        disabled={!acceptButtonsVisibility[index]}
                        aria-label="checkAccept"
                        variant="round"
                        onClick={() => this.handleAcceptClick(bookForSaleId, index)}
                    >
                        <DoneIcon />
                    </Fab>
                </div>
            )
        };

        const renderBookList = (

            <Grid
                container
                spacing={24}
                alignContent='center'
                direction='column'
            >
                {this.renderSnackbar()}
                <Paper className={classes.table} elevation={0}>
                    <div className={classes.header}>
                        <h1>MY LIBRARY</h1>
                    </div>

                    <form noValidate>
                        <StyledTable>
                            <thead>
                                <tr>
                                    <StyledTh>Book Title</StyledTh>
                                    <StyledTh>Author Name</StyledTh>
                                    <StyledTh>Page Count</StyledTh>
                                    <StyledTh>Publisher Name</StyledTh>
                                    <StyledTh>Published Date</StyledTh>
                                    <StyledTh>Sale Status</StyledTh>
                                    <StyledTh>Cover Photo</StyledTh>
                                    <StyledTh>
                                        <EditAttributesIcon fontSize='large' />
                                    </StyledTh>
                                    <StyledTh>Price</StyledTh>
                                    <StyledTh></StyledTh>
                                </tr>
                            </thead>

                            <tbody>
                                {
                                    bookList.map((bookForSale: any, index) => {
                                        return (
                                            <tr key={index}>
                                                <StyledTd>{bookForSale.book.title}</StyledTd>
                                                <StyledTd>
                                                    {bookForSale.book.bookAuthors.map(bookAuthor => bookAuthor.author.authorName).join()}
                                                </StyledTd>
                                                <StyledTd>{bookForSale.book.bookDetail.pageCount}</StyledTd>
                                                <StyledTd>{bookForSale.book.bookDetail.publisherName}</StyledTd>
                                                <StyledTd>{bookForSale.book.bookDetail.publishDate}</StyledTd>
                                                <StyledTd>{getMeaningfullStrings(bookForSale.saleStatus)}</StyledTd>
                                                <StyledTd>{renderCoverPhoto(bookForSale)}</StyledTd>
                                                <StyledTd>{renderEdit(bookForSale, index)}</StyledTd>
                                                <StyledTd>{renderPutForSale(index)}</StyledTd>
                                                <StyledTd>{renderAcceptButton(index, bookForSale.id)}</StyledTd>
                                            </tr>
                                        )
                                    })
                                }
                            </tbody>
                        </StyledTable>
                    </form>
                    {renderAddNewBookButton(classes.filledPaper)}
                </Paper>
            </Grid >
        );

        return (
            <Paper className={classes.paper} elevation={0}>
                {
                    !fetchCompleted ? renderLoading
                        :
                        (bookList.length === 0 ? renderEmptyBookPage : renderBookList)
                }
            </Paper>
        );
    }

}

export default withRouter(withStyles(styles)(SellerBookLibrary) as any) as any