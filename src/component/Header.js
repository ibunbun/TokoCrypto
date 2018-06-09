import React, { Component } from 'react';

class Header extends Component {

	render() {
		return(
			<div className="header">
			  <div className="logo">
			    <h1 className="title">TokoCrypto</h1>
			    <p>Jual beli cryptocurrency yang aman dan terpercaya.</p>
			  </div>
			  <div className="menu">
			    <a href="" onClick={this.props.toggleEwallet} className="ewallet-button">eWallet</a>
			  </div>
			</div>
		);
    }
}

export default Header;