import * as React from 'react';
import { WithStyles, Theme } from '@material-ui/core/styles';
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles';
import { withRouter } from "react-router";
import { FormControl, Input, InputLabel, Button, Grid, Paper, FormHelperText, Select, MenuItem } from '@material-ui/core';
import axios, { AxiosResponse } from 'axios';
import { ChangeEvent } from 'react';
import PhotoCamera from '@material-ui/icons/PhotoCamera';
import ItemsCarousel from 'react-items-carousel';
import MessageBox from './MessageBox';
import { EnumMessageType } from '../enums/EnumMessageType';
import { EnumBookCategory } from '../enums/EnumBookCategory';
const noImageFoundPhoto = require('../resources/noImageFound.jpg');

export interface BookAddProps extends WithStyles<any> {

}

export interface BookAddState {
    bookTitle: string,
    authorName: string,
    publisher: string,
    publishDate: string,
    category: EnumBookCategory,
    coverPhoto: File
    photoUrl: string,
    pageCount: string,
    willMessageShown: boolean,
    isSucceeded: boolean,
    informationMessage: string
}

const bookCategories = Object.keys(EnumBookCategory).filter((key) => isNaN(Number(key)));

const styles = (theme: Theme) => ({
    form: {
        marginTop: theme.spacing.unit,
    },
    paper: {
        ...theme.mixins.gutters(),
        paddingTop: theme.spacing.unit * 2,
        paddingBottom: theme.spacing.unit * 2,
        marginTop: theme.spacing.unit * 5,
        marginLeft: theme.spacing.unit * 20,
        marginRight: theme.spacing.unit * 20,
        height: '700px'
    },
    photoView: {
        height: '600px',
        marginBottom: '5px'
    },
    photoSection: {
        marginLeft: theme.spacing.unit * 5,
        marginRight: theme.spacing.unit * 5,
        marginBottom: theme.spacing.unit * 10
    },
    input: {
        display: 'none',
    },
    extendedIcon: {
        marginRight: theme.spacing.unit,
    },
    noImageFoundImgCss: {
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#333'
    },
    bookPhotosCarouselCss: {
        width: '100%',
        height: '100%',
        display: 'flex',
        background: '#333'
    },
    uploadButtonPaperCss: {
        marginBottom: '5px'
    },
    header: {
        color: theme.palette.primary.main,
        fontFamily:'"Trebuchet MS", Helvetica, sans-serif'
    },
    submit: {
        marginTop: theme.spacing.unit * 3,
    },
    selectEmpty: {
        marginTop: theme.spacing.unit * 2
    }
} as Record<string, CSSProperties>);

class BookAdd extends React.Component<BookAddProps, BookAddState> {

    constructor(props: BookAddProps) {
        super(props);

        this.state = {
            bookTitle: '',
            authorName: '',
            publisher: '',
            publishDate: '',
            category: EnumBookCategory[''],
            coverPhoto: undefined,
            photoUrl: '',
            pageCount: '',
            willMessageShown: false,
            isSucceeded: false,
            informationMessage: ''
        }
    }

    handleBookTitleChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            bookTitle: event.currentTarget.value
        });
    };

    handleBookCategoryChange = (event: React.ChangeEvent<{ value: string }>) => {
        this.setState({
            category: EnumBookCategory[event.target.value]
        });
    };

    handlePublisherChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            publisher: event.currentTarget.value
        });
    };

    handlePublishDateChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            publishDate: event.currentTarget.value
        });
    }

    handleAuthorChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            authorName: event.currentTarget.value
        });
    };

    handlePageCountChange = (event: ChangeEvent<HTMLTextAreaElement | HTMLInputElement>) => {
        this.setState({
            pageCount: event.currentTarget.value
        });
    };

    handleAddBookOnClick = () => {
        const url = `/api/Book/CreateNewBook`;
        let currentState = this.state;

        let addBookParams = new FormData();
        addBookParams.set("BookTitle", currentState.bookTitle);
        addBookParams.set("AuthorName", currentState.authorName);
        addBookParams.set("BookCategory", EnumBookCategory[currentState.category]);
        addBookParams.set("PageCount", currentState.pageCount);
        addBookParams.set("PublishDate", currentState.publishDate);
        addBookParams.set("PublisherName", currentState.publisher);
        addBookParams.append("CoverPhoto", currentState.coverPhoto ? currentState.coverPhoto : null);

        axios.post(url, addBookParams)
            .then((response: AxiosResponse<any>) => {
                let informationMessage = "The book has been added successfully.";

                const data = response.data;
                if (!data.IsSucceeded) {
                    informationMessage = "";
                    data.ErrorList.forEach((error: any) => {
                        informationMessage += error.ExceptionMessage + "\n";
                    });
                }

                this.setState({
                    isSucceeded: data.IsSucceeded,
                    willMessageShown: true,
                    informationMessage: informationMessage
                });
            });
    };

    handleOnImageUploaded = (event: any) => {
        if (event.target.files && event.target.files[0]) {
            this.setState({
                coverPhoto: event.target.files[0] as File,
                photoUrl: URL.createObjectURL(event.target.files[0] as File)
            });
        }
    };

    handleMessageBoxClose = () => {
        this.setState({
            willMessageShown: false
        });
    }

    onFocusPublishDateField = () => {
        let labelPublishDate = document.getElementById('labelPublishDate');
        labelPublishDate.innerText = "Publish Date";
    }

    onBlurPublishDateField = () => {
        let labelPublishDate = document.getElementById('labelPublishDate');
        labelPublishDate.innerText = "";
    };

    onKeyPressPageCount = (event: any) => {
        const keyCode = event.keyCode || event.which;
        const keyValue = String.fromCharCode(keyCode);
        if (!(/^\d+$/.test(keyValue))) {
            event.preventDefault();
        }
    };

    renderSnackbar = () => {
        if (this.state.willMessageShown) {
            return (
                <Grid container justify={"flex-end"} className={"{root:{flexGrow:1}}"}>
                    <MessageBox
                        messageType={this.state.isSucceeded ? EnumMessageType.Success : EnumMessageType.Error}
                        isOpened={this.state.willMessageShown}
                        onClose={this.handleMessageBoxClose}
                    >
                        {this.state.informationMessage}
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
        const { bookTitle, authorName, publisher, publishDate, category, photoUrl, pageCount } = this.state;
        const acceptedFile = 'image/*';

        const renderNoPhotosFoundImage = (
            <img src={noImageFoundPhoto}
                className={classes.noImageFoundImgCss}
            />
        );

        const renderAddedCoverPhoto = (
            <img src={photoUrl}
                className={classes.noImageFoundImgCss}
            />
        );

        const renderCategoryCombobox = (
            <FormControl margin="normal" fullWidth>
                <InputLabel shrink htmlFor="category-select">Category</InputLabel>
                <Select
                    id="category-select"
                    name="category-select"
                    value={EnumBookCategory[category]}
                    onChange={this.handleBookCategoryChange} displayEmpty
                    className={classes.selectEmpty}
                >
                    <MenuItem value="">
                        <em>None</em>
                    </MenuItem>
                    {
                        bookCategories.map(category => {
                            return <MenuItem value={EnumBookCategory[category]}>{category}</MenuItem>
                        })
                    }
                </Select>
            </FormControl>
        );

        return (

            <Paper className={classes.paper} elevation={1}>
                {this.renderSnackbar()}
                <Grid container>
                    <Grid item xs={12} sm={6}>

                        <Paper className={classes.photoSection} elevation={0}>

                            <Grid item xs={12}>
                                <Paper className={classes.photoView} elevation={2}>
                                    {photoUrl != "" ? renderAddedCoverPhoto : renderNoPhotosFoundImage}
                                </Paper>
                            </Grid>

                            <Grid item xs={12}>
                                <Paper className={classes.uploadButtonPaperCss} elevation={0}>
                                    <input
                                        id='icon-button-file'
                                        className={classes.input}
                                        type='file'
                                        accept={acceptedFile}
                                        color='primary'
                                        onChange={(event) => this.handleOnImageUploaded(event)}
                                    />
                                    <label htmlFor='icon-button-file'>
                                        <Button
                                            variant='contained'
                                            component='span'
                                            className={classes.button}
                                            size='large'
                                            color='primary'
                                        >
                                            <PhotoCamera className={classes.extendedIcon} />
                                            Upload Photos
                                            </Button>
                                    </label>
                                </Paper>
                            </Grid>

                        </Paper>
                    </Grid>

                    <Grid item xs={12} sm={6}>
                        <form id="formBookAdd" className={classes.form}>
                            <div className={classes.header}>
                                <h1>Add New Book</h1>
                            </div>
                            <FormControl margin="normal" required fullWidth>
                                <InputLabel htmlFor="bookTitle">Book Title</InputLabel>
                                <Input
                                    id="bookTitle" name="bookTitle" value={bookTitle}
                                    autoComplete="bookTitle" autoFocus
                                    onChange={this.handleBookTitleChange}
                                />
                            </FormControl>

                            {renderCategoryCombobox}

                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="publisher">Publisher Name</InputLabel>
                                <Input
                                    id="publisher" name="publisher" value={publisher}
                                    autoComplete="publisher"
                                    onChange={this.handlePublisherChange}
                                />
                            </FormControl>

                            <FormControl margin="normal" required fullWidth>
                                <InputLabel id="labelPublishDate" htmlFor="publishDate"></InputLabel>
                                <Input
                                    id="publishDate" name="publishDate" value={publishDate}
                                    autoComplete="publishDate" type='date'
                                    onFocus={this.onFocusPublishDateField}
                                    onBlur={this.onBlurPublishDateField}
                                    onChange={this.handlePublishDateChange}
                                />
                            </FormControl>

                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="authorName">Author Name</InputLabel>
                                <Input
                                    id="authorName" name="authorName" value={authorName}
                                    autoComplete="authorName"
                                    onChange={this.handleAuthorChange}
                                />
                            </FormControl>

                            <FormControl margin="normal" fullWidth>
                                <InputLabel htmlFor="pageCount">Page Count</InputLabel>
                                <Input
                                    id="pageCount" name="pageCount" value={pageCount}
                                    autoComplete="pageCount"
                                    onChange={this.handlePageCountChange}
                                    onKeyPress={this.onKeyPressPageCount}
                                />
                                <FormHelperText error>You cannot enter any letter.</FormHelperText>
                            </FormControl>

                            <FormControl margin="normal" fullWidth>
                                <Button
                                    type="button"
                                    variant="contained"
                                    color="primary"
                                    className={classes.submit}
                                    onClick={this.handleAddBookOnClick}
                                >
                                    Add
                                </Button>
                            </FormControl>
                        </form>
                    </Grid>

                </Grid>
            </Paper>

        )
    }
}

export default withRouter(withStyles(styles)(BookAdd) as any) as any;