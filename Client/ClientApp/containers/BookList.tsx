import * as React from 'react';
import { withRouter, RouterProps } from 'react-router'
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Theme } from '@material-ui/core';
import Book from '../components/Book';
import Filter from '../components/Filter';
import axios, { AxiosResponse } from 'axios';

export interface BookListProps extends WithStyles<any>, RouterProps {
    fetchUrl: string
}

export interface BookListState {
    bookList: any[]
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
});

class BookList extends React.Component<BookListProps, BookListState> {

    constructor(props: BookListProps) {
        super(props);
        this.state = {
            bookList: []
        };
    }

    componentDidMount() {
        const url = this.props.fetchUrl;
        let list = [];
        axios.get(url)
            .then((response: AxiosResponse) => {
                list = response.data.items;
                return list;
            })
            .then((list: any) => {
                this.setState({
                    bookList: list
                });
            });
    }

    handleCardClick = bookId => () => {
        this.props.history.push("/bookDetail/" + bookId + "/" + "true");
    }

    render() {
        const { classes } = this.props;
        const { bookList } = this.state
        let renderedItem = null;

        const renderedList = bookList != null && bookList.map((item, index) => {
            const imageSource = `https://books.google.com/books/content?id=${item.id}&printsec=frontcover&img=1&zoom=2&source=gbs_api`

            return (
                <Grid className={classes.bookGrid}
                    item md={2}
                    key={index} >

                    <Book bookId={item.id}
                        title={item.volumeInfo.title}
                        author={item.volumeInfo.author}
                        publisher={item.volumeInfo.publisher}
                        imageSource={imageSource}
                        onBookCardClick={this.handleCardClick}
                    />
                </Grid>
            )
        });

        renderedItem = (
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
        )

        return renderedItem;
    }
}

export default withRouter(withStyles(styles)(BookList) as any) as any;