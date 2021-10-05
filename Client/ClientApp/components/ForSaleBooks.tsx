import * as React from 'react';
import { withRouter, RouterProps } from 'react-router'
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Theme, CircularProgress } from '@material-ui/core';
import Book from '../components/Book';
import Filter from '../components/Filter';
import axios, { AxiosResponse } from 'axios';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
const noSale = require('../resources/noSale.jpg');
const noImageFoundPhoto = require('../resources/noImageFound.jpg');

export interface ForSaleBooksProps extends WithStyles<any>, RouterProps {
}

export interface ForSaleBooksState {
    bookList: any[],
    fetchCompleted: boolean
}

const styles = (theme: Theme) => ({
    grid: {
        margin: theme.spacing.unit
    },
    bookGrid: {
        margin: theme.spacing.unit * 2
    },
    filterGrid: {
        margin: theme.spacing.unit * 2
    }
} as Record<string, CSSProperties>);

class ForSaleBooks extends React.Component<ForSaleBooksProps, ForSaleBooksState> {

    constructor(props: ForSaleBooksProps) {
        super(props);
        this.state = {
            bookList: [],
            fetchCompleted: false
        };
    }

    componentDidMount() {
        const url = '/api/Book/GetForSaleBooks';
        let forSaleBooklist = [];
        axios.get(url)
            .then((response: AxiosResponse) => {
                forSaleBooklist = response.data;

                this.setState({
                    bookList: forSaleBooklist,
                    fetchCompleted: true
                });
            })
    }

    handleBookCardClick = (bookId: any) => () => {
        this.props.history.push("/bookDetail/" + bookId + "/" + "true");
    }

    render() {
        const { classes } = this.props;
        const { bookList, fetchCompleted } = this.state;

        const renderLoading = () => {
            <Grid container style={{ marginTop: '30%' }} justify="center" alignItems="center">
                <Grid item sm={12}>
                    <CircularProgress disableShrink />
                </Grid>
            </Grid>
        }

        const renderedList = bookList != null && bookList.map((bookForSale, index) => {
            const isPhotoValid = btoa(atob(bookForSale.book.bookDetail.coverPhoto)) === bookForSale.book.bookDetail.coverPhoto;
            return (
                <Grid className={classes.bookGrid}
                    item md={2}
                    key={index}
                >
                    <Book
                        bookId={bookForSale.book.id}
                        sellerId={bookForSale.sellerId}
                        bookForSaleId={bookForSale.id}
                        title={bookForSale.book.title}
                        price={bookForSale.price}
                        publisher={bookForSale.book.bookDetail.publisherName}
                        saleStatus={bookForSale.saleStatus}
                        author={bookForSale.book.bookAuthors.map((bookAuthor: any) => bookAuthor.author.authorName).join()}
                        imageSource={isPhotoValid ? `data:image/jpeg;base64,${bookForSale.book.bookDetail.coverPhoto}` : noImageFoundPhoto}
                        onBookCardClick={this.handleBookCardClick}
                    />
                </Grid>
            )
        });

        const renderForSaleBooks = (
            <Grid className={classes.grid} container>
                <Grid className={classes.filterGrid} item sm={12}>
                    <Filter></Filter>
                </Grid>
                <Grid item sm={12}>
                    <Grid container justify="center" alignItems="center">
                        {renderedList}
                    </Grid>
                </Grid>
            </Grid>
        );

        const renderNoSale = (
            <Grid className={classes.grid} container>
                <Grid item sm={12}>
                    <Grid container justify="center" alignItems="center">
                        <img src={noSale} />
                    </Grid>
                </Grid>
            </Grid>
        );

        return (
            !fetchCompleted ? renderLoading :
                (
                    bookList.length !== 0
                        ? renderForSaleBooks
                        : renderNoSale
                )
        );
    }
}

export default withRouter(withStyles(styles)(ForSaleBooks) as any) as any;