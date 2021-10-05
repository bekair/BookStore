import * as React from 'react';
import { withRouter, RouterProps } from 'react-router';
import { withStyles, WithStyles } from '@material-ui/core/styles';
import axios, { AxiosResponse } from 'axios';
import * as H from 'history';
import Card from '@material-ui/core/Card';
import CardMedia from '@material-ui/core/CardMedia';
import CardContent from '@material-ui/core/CardContent';
import CardActions from '@material-ui/core/CardActions';
import IconButton from '@material-ui/core/IconButton';
import Typography from '@material-ui/core/Typography';
import FavoriteIcon from '@material-ui/icons/Favorite';
import AddShoppingCartIcon from '@material-ui/icons/AddShoppingCartRounded';
import PeopleIcon from '@material-ui/icons/PeopleRounded';
import { CSSProperties } from '@material-ui/core/styles/withStyles';
import { EnumSaleStatus } from '../enums/EnumSaleStatus';
import { EnumMessageType } from '../enums/EnumMessageType';
import { EnumUserType } from '../enums/EnumUserType';

export interface BookProps extends WithStyles<any>, RouterProps {
	bookId: any,
	sellerId: any,
	bookForSaleId: any,
	imageSource: string,
	title: string,
	publisher: string,
	price: any,
	author: any,
	saleStatus: EnumSaleStatus,
	onBookCardClick?: (bookId) => any,
	location: H.Location
}

export interface BookState {
	expanded: boolean
}

const styles = (theme: any) => ({
	paper: {
		...theme.mixins.gutters(),
		paddingTop: theme.spacing.unit * 2,
		paddingBottom: theme.spacing.unit * 2,
	},
	card: {
		maxWidth: '400px',
		maxHeight: '900px',
		minHeight: '600px',
		minWidth: '300px'
	},
	content: {
		minHeight: '150px',
		[theme.breakpoints.down('sm')]: {
			minHeight: '200px'
		},
		marginBottom: 2
	},
	media: {
		height: 120,
		paddingTop: '56.25%', // 16:9
	},
	actions: {
		display: 'flex',
		marginTop: '50px'
	},
	expand: {
		transform: 'rotate(0deg)',
		transition: theme.transitions.create('transform', {
			duration: theme.transitions.duration.shortest,
		}),
		marginLeft: 'auto',
		[theme.breakpoints.up('sm')]: {
			marginRight: -8,
		},
	},
	expandOpen: {
		transform: 'rotate(180deg)',
	},
} as Record<string, CSSProperties>);

class Book extends React.Component<BookProps, BookState> {

	state = { expanded: false };

	handleExpandClick = () => {
		this.setState(
			state => ({
				expanded: !state.expanded
			})
		);
	};

	buttonAddShoppingCartClick = () => {
		const url = '/api/BuyProcess/AddToCart'
		const { bookForSaleId, sellerId } = this.props;

		const addToCartModel = {
			BookForSaleId: bookForSaleId,
			SellerId: sellerId
		};

		axios.post(url, JSON.stringify(addToCartModel), {
			headers: {
				"Content-Type": "application/json; charset=utf-8"
			}
		}).then((response: AxiosResponse) => {
			const data = response.data;
			debugger;
			if (data.isSucceeded) {
				//Menubar update the badge number but how????
			}
			else {
				const location = {
					pathname: '/',
					state: {
						isMessageShown: true,
						messageType: EnumMessageType.Error,
						informationMessage: 'An error occured.',
						isLoggedIn: true,
						userType: EnumUserType.Buyer
					}
				};

				this.props.history.push(location);
			}
		});
	};

	render() {
		const { classes, bookId, imageSource, title, publisher, price, author, saleStatus } = this.props;

		return (
			<Card className={classes.card}>
				<CardMedia
					className={classes.media}
					image={imageSource}
					title={title}
					onClick={this.props.onBookCardClick(bookId)}
				/>
				<CardContent className={classes.content}>
					<Typography gutterBottom variant="h5" component="h2">
						{title}
					</Typography>
					<Typography variant="h6" color="textSecondary" component="p">
						<b>Author:</b> {author}
					</Typography>
					<Typography variant="h6" color="textSecondary" component="p">
						<b>Publisher:</b> {publisher}
					</Typography>
					{saleStatus === EnumSaleStatus.ForSale
						?
						<Typography style={{ marginTop: '20px', color: 'black' }} variant="h5" component="p">
							<span style={{ backgroundColor: '#D50000', color: 'white', padding: '10px' }}>
								BEST PRICE
							</span>
							<b style={{ marginLeft: '30px' }}>{price} ₺</b>
						</Typography>
						:
						''
					}
				</CardContent>
				{saleStatus === EnumSaleStatus.ForSale
					?
					<CardActions className={classes.actions} disableActionSpacing>
						<IconButton aria-label="Add to favorites">
							<FavoriteIcon />
						</IconButton>
						<IconButton onClick={this.buttonAddShoppingCartClick} aria-label="Add to shopping cart">
							<AddShoppingCartIcon />
						</IconButton>
						<IconButton aria-label="Contact to seller">
							<PeopleIcon />
						</IconButton>
					</CardActions>
					:
					''
				}
			</Card>
		);
	}
}

export default withRouter(withStyles(styles)(Book) as any) as any;