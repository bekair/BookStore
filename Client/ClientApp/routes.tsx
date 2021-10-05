import * as React from 'react';
import { Route } from 'react-router-dom';
import { Layout } from './Layout';
import Home from './Home';
import BookDetail from './components/BookDetail';
import SignUp from './components/SignUp';
import SellerBookLibrary from './components/SellerBookLibrary'
import BookAdd from './components/BookAdd';
import AccountInformation from './components/AccountInformation';
import ForSaleBooks from './components/ForSaleBooks';
import ShoppingCart from './components/ShoppingCart';

export const routes = (
	<Layout>
		<Route exact path='/' component={Home} />
		<Route exact path='/signUp' component={SignUp} />
		<Route exact path='/sellerBookLibrary' component={SellerBookLibrary} />
		<Route exact path='/forSaleBooks' component={ForSaleBooks} />
		<Route exact path='/accountInformation' component={AccountInformation} />
		<Route exact path='/bookAdd' component={BookAdd} />
		<Route exact path='/bookDetail/:id/:indexed' component={BookDetail} />
		<Route exact path='/shoppingCart' component={ShoppingCart} />
	</Layout>
);
