import React, { Component } from 'react';

class Transactform extends Component {

	render() {
		let cryptName = this.props.cryptName;
		return(
			<div className={ this.props.formShow ? "transact-form show" : "transact-form" }>
	          <h2>{this.props.cryptName}</h2>
	          <p>Price: {this.props.cryptPrice} IDR</p>
	          <div className="transact-option">
	            <a href="" onClick={this.props.toggleTransact} className={ this.props.transactShow ? "buy-tab" : "buy-tab active" }>BUY</a>
	            <a href="" onClick={this.props.toggleTransact} className={ this.props.transactShow ? "sell-tab active" : "sell-tab" }>SELL</a>
	          </div>
	          <div className={ this.props.transactShow ? "buy-form" : "buy-form show" }>
	            <p className="balance">Your Rupiah: {this.props.ewallet['Rupiah']}</p>
	            <p>Input Rupiah:</p>
	            <input id="rupiahVal" type="number" onChange={this.props.handleCalc('buy')} />
	            <p>Get {this.props.cryptName}:</p>
	            <input type="text" value={this.props.cryptGet} disabled />
	            <a href="" onClick={this.props.handleBuy}>BUY</a>
	          </div>
	          <div className={ this.props.transactShow ? "sell-form show" : "sell-form" }>
	            <p className="balance">Your {this.props.cryptName}: {this.props.ewallet[cryptName] ? this.props.ewallet[cryptName] : '0'}</p>
	            <p>Input {this.props.cryptName}:</p>
	            <input id="cryptVal" type="number" onChange={this.props.handleCalc('sell')} />
	            <p>Get Rupiah:</p>
	            <input type="text" value={this.props.cryptGetRp} disabled />
	            <a href="" onClick={this.props.handleSell}>SELL</a>
	          </div>
	          <div style={{textAlign:'center'}}><a href="" onClick={this.props.toggleForm} className="close-button">CLOSE</a></div>
	        </div>
		);
    }
}

export default Transactform;