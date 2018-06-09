import React, { Component } from 'react';

class Cryptos extends Component {

	constructor() {
		super();
		this.state = {
		  cryptos: []
		};
	}

	componentDidMount() {
		this.loadCryptos();

		// Fetch new cryptos every 5 min
		setInterval( ()=> this.loadCryptos(), 300000 );
	}

	async loadCryptos() {
		try {
		  fetch('https://api.coinmarketcap.com/v1/ticker/?limit=100&convert=IDR')
		  .then(results => {
		    return results.json();
		  }).then(json => {
		    this.setState({
		      cryptos: json,
		    });
		  }).catch(e => console.log(e) );
		} catch (e) {
		  console.log(e);
		}
	}

   /**
	* Sort list of cryptocurrency based on column title (asc/desc)
	* @param (string) sortKey [column title]
	*/
	handleSort = (sortKey) => (e) => {
		const data = this.state.cryptos;
		// Get sort direction
		let order = e.currentTarget.dataset['sort'];

		function compareValues(key, order='asc') {
		  return function(a, b) {

		    let varA = "";
		    let varB = "";

		    if (key === 'name'){
		      varA = a[key].toUpperCase();
		      varB = b[key].toUpperCase();
		    } else {
		      varA = parseFloat(a[key]);
		      varB = parseFloat(b[key]);
		    }

		    let comparison = 0;

		    if (varA > varB) {
		      comparison = 1;
		    } else if (varA < varB) {
		      comparison = -1;
		    }
		    
		    return (
		      (order === 'desc') ? (comparison * -1) : comparison
		    );
		  };
		}

		data.sort(compareValues(sortKey,order));

		let newOrder = "";

		if (order === 'asc') {
		  newOrder = 'desc';
		} else {
		  newOrder = 'asc';
		}

		// Update column title sort direction
		e.currentTarget.setAttribute('data-sort',newOrder);

		this.setState({
		  cryptos: data
		})
	}

	render() {
		return(
			<div className="crypto-table-wrapper">
	          <h2>Top 100 Cryptocurrency in the Market</h2>
	          <h6>Tip: click on the column title to sort specifically by asc/desc</h6>
	          <div style={{overflowX:'auto'}}>
	            <table className="crypto-table">
	              <thead>
	                <tr>
	                  <th onClick={this.handleSort('rank')} data-sort="desc" title="Sort by Rank">Rank&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                  <th onClick={this.handleSort('name')} data-sort="asc" title="Sort by Name">Name&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                  <th onClick={this.handleSort('price_idr')} data-sort="asc" title="Sort by Price">Price&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                  <th onClick={this.handleSort('percent_change_24h')} data-sort="desc" title="Sort by Change in 24 hour">Change (24 hour)&nbsp;&nbsp;<span className="sort"><span>&#9650;</span><span>&#9660;</span></span></th>
	                </tr>
	              </thead>
	              <tbody>
	                {this.state.cryptos.map((val, key) => {

	                  let price = val.price_idr;
	                  let changeClass;

	                  // Give red/green color to percentage
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

export default Cryptos;