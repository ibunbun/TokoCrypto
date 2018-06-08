import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      cryptos: []
    };
  }

  componentDidMount() {
    fetch('https://api.coinmarketcap.com/v1/ticker/?limit=10&convert=IDR')
    .then(results => {
      return results.json();
    }).then(json => {
      //console.log(json);
      this.setState({
        cryptos: json
      });
    });
  }

  onSort(event, sortKey){
    const data = this.state.cryptos;
    let order = event.currentTarget.dataset['sort'];

    function compareValues(key, order='asc') {
      return function(a, b) {

        let varA = "";
        let varB = "";

        if (key == 'name'){
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
          (order == 'desc') ? (comparison * -1) : comparison
        );
      };
    }

    data.sort(compareValues(sortKey,order));

    let newOrder = "";

    if (order == 'asc') {
      newOrder = 'desc';
    } else {
      newOrder = 'asc';
    }

    event.currentTarget.setAttribute('data-sort',newOrder);

    this.setState({
      cryptos: data
    })
  }

  filterPrice(price) {
    price = Math.round(price);
    return price;
  }

  render() {
      var cryptoItems = this.state.cryptos;

      return (
      <table className="m-table">
        <thead>
          <tr>
            <th onClick={e => this.onSort(e, 'rank')} data-sort="desc">Rank</th>
            <th onClick={e => this.onSort(e, 'name')} data-sort="asc">Name</th>
            <th onClick={e => this.onSort(e, 'price_idr')} data-sort="asc">Price</th>
            <th onClick={e => this.onSort(e, 'percent_change_24h')} data-sort="desc">Change (24 hour)</th>
          </tr>
        </thead>
        <tbody>
          {cryptoItems.map((val, key) => {
            let price = this.filterPrice(val.price_idr);
            return (
              <tr key={key} data-item={val}>
                <td data-title="rank">{val.rank}</td>
                <td data-title="name">{val.name}</td>
                <td data-title="price">Rp {price.toLocaleString('id')}</td>
                <td data-title="change">{val.percent_change_24h}%</td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
    
  }
}

export default App;
