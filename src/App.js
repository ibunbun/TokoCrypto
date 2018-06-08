import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      cryptos: [],
      ewallet: [{'name':'Rupiah','amount':'10000000'}],
      cryptName: '',
      cryptPrice: '',
      cryptGet: '0',
      cryptGetRp: '0'
    };
  }

  componentDidMount() {
    fetch('https://api.coinmarketcap.com/v1/ticker/?limit=10&convert=IDR')
    .then(results => {
      return results.json();
    }).then(json => {
      //console.log(json);
      this.setState({
        cryptos: json,
      });
    });
  }

  handleSort(e, sortKey){
    const data = this.state.cryptos;
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

    e.currentTarget.setAttribute('data-sort',newOrder);

    this.setState({
      cryptos: data
    })
  }

  handleForm(e) {
    let name = e.currentTarget.dataset['name'];
    let price = e.currentTarget.dataset['price'];

    document.getElementById("insertVal").value = "";

    this.setState({
      cryptName: name,
      cryptPrice: price,
      cryptGet: "0"
    })
  }

  handleCalc(e,transact) {
    let value = parseFloat(e.currentTarget.value);
    let price = parseFloat(this.state.cryptPrice);

    if (Math.sign(value) === 1 && Math.sign(price) === 1){
      
      if (transact === 'buy') {
        let get = value/price;
        get = this.filterPrice(get);
        //get = get.toFixed(2);

        this.setState({
          cryptGet: get
        })
      } else {
        let get = price * value;
        get = this.filterPrice(get);

        this.setState({
          cryptGetRp: get
        })
      }
    } else {
      this.setState({
        cryptGet: '0',
        cryptGetRp: '0'
      })
    }
  }

  handleBuy(e) {
    let rupiah = this.state.ewallet[0].amount;

    let valRupiah = document.getElementById("insertVal").value;

    if (parseFloat(valRupiah) > parseFloat(rupiah)) {
      alert("Saldo tidak mencukupi");
    } else {
      rupiah = rupiah - valRupiah;
      let data = this.state.ewallet;
      data[0].amount = rupiah;
      data.push({'name':this.state.cryptName, 'amount':this.state.cryptGet});
      this.setState({
        ewallet: data,
        cryptGet: "0"
      });

      document.getElementById("insertVal").value = "";

      alert("Transaksi Sukses");
    }
  }

  handleSell(e) {
    let rupiah = this.state.ewallet[0].amount;
    let valCrypt = document.getElementById("insertVal2").value;

    let ewallet = this.state.ewallet;
    let crypt = ewallet.filter(( obj ) => {
      return obj.name === this.state.cryptName;
    });

    if (crypt.length > 0) {
      crypt = crypt[0].amount;
    } else {
      crypt = 0;
    }

    if (parseFloat(valCrypt) > parseFloat(crypt)) {
      alert("Saldo tidak mencukupi");
    } else {
      rupiah = rupiah + this.state.cryptGetRp;
      crypt = crypt - valCrypt;

      let data = this.state.ewallet;

      function updateAmount( name, amount ) {
        for (var i in data) {
          if (data[i].name === name) {
            data[i].amount = amount;
            break;
          }
        }
      }

      updateAmount(this.state.cryptName, crypt);
      data[0].amount = rupiah;

      this.setState({
        ewallet: data,
        cryptGetRp: "0"
      });

      document.getElementById("insertVal2").value = "";

      alert("Transaksi Sukses");
    }
  }

  filterPrice(price) {
    //price = Math.round(price);
    //price = parseFloat(price).toLocaleString('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
    return price;
  }

  render() {

    var cryptoItems = this.state.cryptos;
    var ewallet = this.state.ewallet;

    return (
      <div>
        <table className="m-table">
          <thead>
            <tr>
              <th onClick={e => this.handleSort(e, 'rank')} data-sort="desc">Rank</th>
              <th onClick={e => this.handleSort(e, 'name')} data-sort="asc">Name</th>
              <th onClick={e => this.handleSort(e, 'price_idr')} data-sort="asc">Price</th>
              <th onClick={e => this.handleSort(e, 'percent_change_24h')} data-sort="desc">Change (24 hour)</th>
            </tr>
          </thead>
          <tbody>
            {cryptoItems.map((val, key) => {
              let price = this.filterPrice(val.price_idr);
              return (
                <tr key={key} data-price={price} data-name={val.name} onClick={e => this.handleForm(e)}>
                  <td data-title="rank">{val.rank}</td>
                  <td data-title="name">{val.name}</td>
                  <td data-title="price">Rp {price}</td>
                  <td data-title="change">{val.percent_change_24h}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div>
          <p>Your balance:</p>
          {ewallet.map((val, key) => {
            let amount = val.amount;
            return (
              <li key={key}>{val.name}: {amount}</li>
            );
          })}
        </div>

        <div>
          <p>{this.state.cryptName}</p>
          <p>Price: {this.state.cryptPrice}</p>
          <div>
            <p>Buy</p>
            <p>Input Rupiah:</p>
            <input id="insertVal" type="text" onChange={e => this.handleCalc(e,'buy')} />
            <p>Get {this.state.cryptName}:</p>
            <input type="text" value={this.state.cryptGet} disabled />
            <button onClick={e => this.handleBuy(e)}>BUY</button>
          </div>
          <div>
            <p>Sell</p>
            <p>Input {this.state.cryptName}:</p>
            <input id="insertVal2" type="text" onChange={e => this.handleCalc(e,'sell')} />
            <p>Get Rupiah:</p>
            <input type="text" value={this.state.cryptGetRp} disabled />
            <button onClick={e => this.handleSell(e)}>SELL</button>
          </div>
        </div>
      </div>
    );
  }
}

export default App;
