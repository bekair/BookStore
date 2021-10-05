import * as React from 'react';
import { WithStyles, Theme } from '@material-ui/core/styles';
import { RouteComponentProps, withRouter } from 'react-router';
import withStyles, { CSSProperties } from '@material-ui/core/styles/withStyles';
import { SuggestionsFetchRequestedParams, InputProps } from 'react-autosuggest';
import * as Autosuggest from "react-autosuggest";
import SearchIcon from '@material-ui/icons/Search';
import { fade } from '@material-ui/core/styles/colorManipulator';
import { EnumBookSearchCriteria } from '../enums/EnumBookSearchCriteria';
import axios from 'axios';

export interface SearchBarProps extends WithStyles<any> {
    classes: any,
    placeholder: string,
    data?: { title: string, data: [any] }[]
}

export interface SearchBarState {
    searchFocus: Boolean,
    suggestions: { title: string, data: [any] }[],
    searchValue: string
}

const themeStyles = (theme: Theme) => ({
    search: {
        position: 'relative',
        borderRadius: theme.shape.borderRadius,
        backgroundColor: fade(theme.palette.common.white, 0.15),
        '&:hover': {
            backgroundColor: fade(theme.palette.common.white, 0.25),
        },
        marginRight: theme.spacing.unit * 2,
        marginLeft: 0,
        width: '100%',
        [theme.breakpoints.up('sm')]: {
            marginLeft: theme.spacing.unit * 3,
            width: 'auto'
        }
    },
    searchIcon: {
        width: theme.spacing.unit * 9 as number,
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        position: 'relative',
        color: 'inherit',
        border: '2px solid #aaa',
        borderRadius: 4
    },
    input: {
        background: 'transparent',
        border: 'none',
        color: '#fff',
        transition: theme.transitions.create('width') as string,
        width: '100%',
        [theme.breakpoints.up('md') as string]: {
            width: 200
        },
        paddingTop: theme.spacing.unit as number,
        paddingRight: theme.spacing.unit as number,
        paddingBottom: theme.spacing.unit as number,
        paddingLeft: theme.spacing.unit * 8 as number,
        borderRadius: theme.shape.borderRadius as number,
        '&:focus': {
            [theme.breakpoints.up('md') as string]: {
                width: 300
            }
        },
        fontWeight: 'bold',
        fontSize: 14
    },
    inputFocused: {
        outlineStyle: 'none'
    },
    inputOpen: {
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0
    },
    suggestionsContainer: {
        display: 'none',
    },
    suggestionsContainerOpen: {
        color: '#000',
        display: 'block',
        position: 'absolute',
        border: '2px solid #aaa',
        backgroundColor: '#fff',
        fontWeight: 'bold',
        fontSize: 16,
        borderRadius: 4,
        zIndex: 2,
        width: '100%'
    },
    suggestionsList: {
        margin: 0,
        paddingBottom: 5,
        paddingLeft: 10,
        paddingRight: 10,
        listStyleType: 'none',
    },
    suggestion: {
        cursor: 'pointer',
        padding: '10px'
    },
    suggestionHighlighted: {
        backgroundColor: '#ddd',
        color: '#000',
        borderColor: '#002884',
        borderBottomLeftRadius: 5,
        borderBottomRightRadius: 5,
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5
    },
    sectionContainer: {
        borderTopWidth: 1,
        borderTopStyle: 'dashed',
        borderTopColor: '#ccc'
    },
    sectionContainerFirst: {
        borderTop: 0
    },
    sectionTitle: {
        padding: '10px 0 0 10px',
        fontSize: 14,
        fontWeight: 'bold',
        color: '#002884'
    }
} as Record<string, CSSProperties>);

let bookList: any[] = [];
class SearchBar extends React.Component<SearchBarProps, SearchBarState>{

    constructor(props: any) {
        super(props);

        this.state = {
            searchFocus: false,
            suggestions: this.props.data != null ? this.props.data : [],
            searchValue: ""
        };
    }

    getSuggestedBooksFromApi = async (searchValue: string) => {
        const criteria = EnumBookSearchCriteria.FullText;
        const url = `/api/Book/FetchBooksForSearchSuggestion?criteria=${criteria}&searchkey=${searchValue}`

        const response = await axios.get(url, {
            headers: {
                "Content-Type": "application/json; charset=utf-8"
            }
        });
        const responseData = await response.data;

        bookList = responseData.map((book: any) => {
            let authorString = "";

            if (book.Authors != null) {
                book.Authors.forEach((author: string) => {
                    authorString = authorString == "" ? author : `${authorString}, ${author}`;
                });
            }
            else {
                authorString = "No Author Information";
            }

            return {
                title: authorString,
                data: [{
                    name: book.Title,
                }]
            };
        });

        return await bookList;
    }

    escapeRegexCharacters = (str: string) => {
        return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    }

    getSuggestions = async (searchValue: string) => {
        const escapedValue = this.escapeRegexCharacters(searchValue.trim());

        if (escapedValue === "") {
            return [];
        }

        const regex = new RegExp("^" + escapedValue, "i");
        const bookList = await this.getSuggestedBooksFromApi(searchValue);

        return bookList.map((book: any) => {
            return {
                title: book.title,
                data: book.data.filter((data: any) =>
                    regex.test(data.name)
                )
            };
        })
            .filter((section: any) => section.data.length > 0);
    }

    onSuggestionsFetchRequested = async (request: SuggestionsFetchRequestedParams) => {
        this.setState({
            suggestions: await this.getSuggestions(request.value)
        });
    };

    onSuggestionsClearRequested = () => {
        this.setState({
            suggestions: []
        });
    };

    getSuggestionValue = (suggestion: any) => {
        return suggestion.name as string;
    }

    getSectionSuggestions(section: any) {
        return section.data;
    }

    renderSuggestion = (suggestion: any) => {
        return <span>{suggestion.name}</span>;
    }

    renderSectionTitle(section: any) {
        return <strong>{section.title}</strong>;
    }

    handleSearchOnFocus = () => {
        if (!this.state.searchFocus) {
            this.setState({
                searchFocus: true
            });
        }
    }

    handleSearchOnBlur = () => {
        if (this.state.searchFocus) {
            this.setState({
                searchFocus: false
            });
        }
    }

    handleSearchOnChange = (event: React.FormEvent<any>, changeEvent: Autosuggest.ChangeEvent) => {
        this.setState({
            searchValue: changeEvent.newValue
        });
    };

    shouldRenderSuggestions = (searchValue: string) => {
        return searchValue.trim().length > 2;
    }

    render() {
        const { classes, placeholder } = this.props;
        const { suggestions, searchValue } = this.state;
        const inputProps = {
            placeholder: placeholder,
            value: searchValue,
            onChange: this.handleSearchOnChange,
            onFocus: this.handleSearchOnFocus,
            onBlur: this.handleSearchOnBlur
        }

        return (
            <div className={classes.search}>
                <div className={classes.searchIcon}>
                    <SearchIcon />
                </div>
                <Autosuggest
                    theme={classes}
                    multiSection={true}
                    suggestions={suggestions}
                    onSuggestionsFetchRequested={this.onSuggestionsFetchRequested}
                    onSuggestionsClearRequested={this.onSuggestionsClearRequested}
                    getSuggestionValue={this.getSuggestionValue}
                    renderSuggestion={this.renderSuggestion}
                    renderSectionTitle={this.renderSectionTitle}
                    getSectionSuggestions={this.getSectionSuggestions}
                    shouldRenderSuggestions={this.shouldRenderSuggestions}
                    inputProps={inputProps}>
                </Autosuggest>
            </div>
        );
    }
}

export default withStyles(themeStyles)(SearchBar);