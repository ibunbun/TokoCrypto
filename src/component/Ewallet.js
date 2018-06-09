import React, { Component } from 'react';

class Ewallet extends Component {

	render() {
		return(
			<div className={ this.props.ewalletShow ? "ewallet show" : "ewallet" }>

	          <h2>Your Current Balance</h2>

	          <table className="ewallet-table">
	            <thead>
	              <tr>
	                <th>Currency</th>
	                <th>Amount</th>
	              </tr>
	            </thead>
	            <tbody>
	              {Object.keys(this.props.ewallet).map((key) => {
	              if (key === 'Rupiah' || (key !== 'Rupiah' && this.props.ewallet[key] > 0)){
	                return (
	                    <tr key={key}> 
	                      <td>{key}</td>
	                      <td>{parseFloat(this.props.ewallet[key]).toLocaleString('id', { minimumFractionDigits: 0, maximumFractionDigits: 15})}</td>
	                    </tr>
	                );
	              } else {
	                return (<tr key={key} stlye={{display:"none"}}></tr>);
	              }
	            })}
	            </tbody>
	          </table>
	          
	          <a href="" onClick={this.props.toggleEwallet} className="close-button">CLOSE</a>
	        </div>
		);
    }
}

export default Ewallet;