import * as React from 'react';
import { withRouter, RouteComponentProps } from 'react-router';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import { Grid, Typography, Divider, Avatar, Theme } from '@material-ui/core';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import Paper from '@material-ui/core/Paper';
import red from '@material-ui/core/colors/red';
import { ProviderProps } from 'react-redux';
import axios from 'axios';
import AccountBalanceIcon from '@material-ui/icons/AccountBalanceRounded';
import BookmarksIcon from '@material-ui/icons/BookmarksRounded';
import SubtitlesIcon from '@material-ui/icons/SubtitlesRounded';
import CategoryIcon from '@material-ui/icons/CategoryRounded';
import LanguageIcon from '@material-ui/icons/LanguageRounded';
import AttachFileIcon from '@material-ui/icons/AttachFileRounded';

export interface BookDetailParams {
  id: string,
  indexed: string
}

export interface BookDetailProps extends WithStyles<any>,
  ProviderProps,
  RouteComponentProps<BookDetailParams> {
}

export interface BookDetailState {
  book: any
}

const styles = (theme: Theme) => ({
  grid: {
    margin: 4
  },
  paper: {
    ...theme.mixins.gutters(),
    paddingTop: theme.spacing.unit * 2,
    paddingBottom: theme.spacing.unit * 2,
  },
  card: {
    maxWidth: 575,
  },
  media: {
    height: 716,
    width: 575,
  },
  actions: {
    display: 'flex',
  },
  avatar: {
    backgroundColor: theme.palette.secondary.main,
    color: '#fff',
  },
});

class BookDetail extends React.Component<BookDetailProps, BookDetailState> {
  constructor(props: any) {
    super(props);
    this.state = {
      book: null
    };
  }

  componentDidMount() {
    const { match: { params } } = this.props;
    const url = `https://www.googleapis.com/books/v1/volumes/${params.id}`;
    axios.get(url)
      .then((response: any) => {
        this.setState({
          book: response.data
        })
      });
  }

  render() {
    const { classes } = this.props;
    const { book } = this.state;

    if (book) {
      const id = book.id;
      const imageSource = `https://books.google.com/books/content?id=${id}&printsec=frontcover&img=1&zoom=3&source=gbs_api`;
      const categories = book.volumeInfo.categories ? book.volumeInfo.categories.join(", ") : "";

      return (
        <Paper className={classes.paper} elevation={2}>
          <Grid container>
            <Grid item sm={12}>
              <Typography variant="h3" gutterBottom>
                {book.volumeInfo.title}
              </Typography>
            </Grid>
            <Grid item sm={6}>
              <Card className={classes.card}>
                <CardMedia
                  className={classes.media}
                  image={imageSource}>
                </CardMedia>
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Grid container>
                <Grid item className={classes.grid} sm={12}>
                  <Grid container>
                    <Grid item sm={1}>
                      <Avatar className={classes.avatar}>
                        <BookmarksIcon />
                      </Avatar>
                    </Grid>
                    <Grid item sm={10}>
                      <Typography variant="body1">
                        {book.volumeInfo.description}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.grid} item sm={12}>
                  <Grid container>
                    <Grid item sm={1}>
                      <Avatar className={classes.avatar}>
                        <SubtitlesIcon />
                      </Avatar>
                    </Grid>
                    <Grid item sm={11}>
                      <Typography variant="overline" align={"justify"}>
                        {book.volumeInfo.subtitle}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.grid} item sm={12}>
                  <Grid container>
                    <Grid item sm={1}>
                      <Avatar className={classes.avatar}>
                        <AccountBalanceIcon />
                      </Avatar>
                    </Grid>
                    <Grid item sm={11}>
                      <Typography variant="overline">
                        {book.volumeInfo.publisher}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.grid} item sm={12}>
                  <Grid container>
                    <Grid item sm={1}>
                      <Avatar className={classes.avatar}>
                        <CategoryIcon />
                      </Avatar>
                    </Grid>
                    <Grid item sm={11}>
                      <Typography variant="overline">
                        {categories}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid className={classes.grid} item sm={12}>
                <Grid container>
                    <Grid item sm={1}>
                      <Avatar className={classes.avatar}>
                        <AttachFileIcon />
                      </Avatar>
                    </Grid>
                    <Grid item sm={11}>
                      <Typography variant="overline">
                        {book.volumeInfo.pageCount}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item sm={12}>
                  <Typography variant="h6">
                    {book.volumeInfo.publishDate}
                  </Typography>
                </Grid>
                <Grid className={classes.grid} item sm={12}>
                  <Grid container>
                    <Grid item sm={1}>
                      <Avatar className={classes.avatar}>
                        <LanguageIcon />
                      </Avatar>
                    </Grid>
                    <Grid item sm={11}>
                      <Typography variant="overline">
                        {book.volumeInfo.language}
                      </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      )
    } else {
      return null;
    }
  }
}

export default (withRouter(withStyles(styles as any)(BookDetail) as any) as any);