import React, { Component } from 'react';

class Cryptotable extends Component {

	render() {
		return(
			<div className="crypto-table-wrapper">
	          <h2>Top 100 Cryptocurrency in the Market</h2>
	          <h6>Tip: click on the column title to sort specifically by asc/desc</h6>
	          <div style={{overflowX:'auto'}}>
	            <table className="crypto-table">
	              <thead>
	                <tr>
	                  <th onClick={this.props.handleSort('rank')} data-sort="desc" title="Sort by Rank">Rank&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                  <th onClick={this.props.handleSort('name')} data-sort="asc" title="Sort by Name">Name&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                  <th onClick={this.props.handleSort('price_idr')} data-sort="asc" title="Sort by Price">Price&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                  <th onClick={this.props.handleSort('percent_change_24h')} data-sort="desc" title="Sort by Change in 24 hour">Change (24 hour)&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                </tr>
	              </thead>
	              <tbody>
	                {this.props.cryptos.map((val, key) => {
	                  let price = val.price_idr;

	                  let changeClass;

	                  if (Math.sign(val.percent_change_24h) === -1) {
	                    changeClass = 'dec';
	                  } else {
	                    changeClass = 'inc';
	                  }

	                  return (
	                    <tr key={key} data-price={price} data-name={val.name} onClick={this.props.handleForm}>
	                      <td data-title="rank">{val.rank}</td>
	                      <td data-title="name" className="name-col">{val.name}</td>
	                      <td data-title="price" className="price-col">Rp {parseFloat(price).toLocaleString('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
	                      <td data-title="change" className={changeClass}>{val.percent_change_24h}%</td>
	                    </tr>
	                  );
	                })}
	              </tbody>
	            </table>
	          </div>
	        </div>
		);
    }
}

export default Cryptotable;