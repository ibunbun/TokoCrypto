import React, { Component } from 'react';
//import logo from './logo.svg';
import './reset.css';
import './App.css';

class App extends Component {
  constructor() {
    super();
    this.state = {
      cryptos: [],
      ewallet: {'Rupiah':'10000000'},
      cryptName: '',
      cryptPrice: '',
      cryptGet: '0',
      cryptGetRp: '0',
      ewalletShow: false,
      formShow: false,
      overlayShow: false,
      transactShow: false
    };
  }

  componentDidMount() {
    this.loadCryptos();

    // fetch new cryptos every 5 min
    setInterval(()=> this.loadCryptos(), 300000);

    // Check for localstorage
    let localEwallet = localStorage.getItem('ewallet');

    if (localEwallet) {
      localEwallet = JSON.parse(localEwallet);
      this.setState({
        ewallet : localEwallet
      });
    }
  }

  async loadCryptos() {
    try {
      fetch('https://api.coinmarketcap.com/v1/ticker/?limit=100&convert=IDR')
      .then(results => {
        return results.json();
      }).then(json => {
        //console.log(json);
        this.setState({
          cryptos: json,
        });
      }).catch(e => console.log(e) );
    } catch (e) {
      console.log(e);
    }
  }

  toggleEwallet(e) {
    e.preventDefault();
    let ewalletShow = !this.state.ewalletShow;
    let overlayShow = !this.state.overlayShow;
    this.setState({ ewalletShow: ewalletShow, overlayShow: overlayShow });
  }

  toggleForm(e) {
    e.preventDefault();
    let formShow = !this.state.formShow;
    let overlayShow = !this.state.overlayShow;
    this.setState({ 
      formShow: formShow,
      overlayShow: overlayShow,
      cryptGet: "0",
      cryptGetRp: "0"
    });
    document.getElementById("cryptVal").value = "";
    document.getElementById("rupiahVal").value = "";
  }

  toggleTransact(e) {
    e.preventDefault();
    let transactShow = !this.state.transactShow;
    this.setState({ 
      transactShow: transactShow,
      cryptGet: "0",
      cryptGetRp: "0" 
    });
    document.getElementById("cryptVal").value = "";
    document.getElementById("rupiahVal").value = "";
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

    document.getElementById("rupiahVal").value = "";
    document.getElementById("cryptVal").value = "";

    this.setState({
      cryptName: name,
      cryptPrice: price,
      cryptGet: "0"
    })

    this.toggleForm(e);
  }

  handleCalc(e,transact) {
    let value = parseFloat(e.currentTarget.value);
    let price = parseFloat(this.state.cryptPrice);

    if (Math.sign(value) === 1 && Math.sign(price) === 1){
      
      if (transact === 'buy') {
        let get = value/price;
        //get = get.toFixed(2);

        this.setState({
          cryptGet: get,
          cryptGetRp: '0'
        })

        document.getElementById("cryptVal").value = "";
      } else {
        let get = price * value;

        this.setState({
          cryptGetRp: get,
          cryptGet: '0'
        })

        document.getElementById("rupiahVal").value = "";
      }
    } else {
      this.setState({
        cryptGet: '0',
        cryptGetRp: '0'
      })

      if (transact === 'buy') {
        document.getElementById("cryptVal").value = "";
      } else {
        document.getElementById("rupiahVal").value = "";
      }
    }
  }

  handleBuy(e) {
    e.preventDefault();
    let rupiah = parseFloat(this.state.ewallet['Rupiah']);
    let valRupiah = parseFloat(document.getElementById("rupiahVal").value);
    let cryptName = this.state.cryptName;

    if (valRupiah > rupiah) {
      alert("Saldo tidak mencukupi");
    } else {
      if ( valRupiah > 0 && this.state.cryptGet > 0) {
        rupiah = rupiah - valRupiah;

        let data = this.state.ewallet;

        data['Rupiah'] = rupiah;

        if (data[cryptName] > 0) {
          data[cryptName] = data[cryptName] + this.state.cryptGet;
        } else {
          data[cryptName] = this.state.cryptGet;
        }
        
        this.setState({
          ewallet: data,
          cryptGet: "0"
        });

        localStorage.setItem("ewallet", JSON.stringify(data));

        document.getElementById("rupiahVal").value = "";

        alert("Transaksi berhasil");
      } else {
        alert("Masukkan jumlah rupiah");
      }
    }
  }

  handleSell(e) {
    e.preventDefault();
    let rupiah = parseFloat(this.state.ewallet['Rupiah']);
    let valCrypt = parseFloat(document.getElementById("cryptVal").value);
    let cryptName = this.state.cryptName;

    let data = this.state.ewallet;
    let crypt = 0;

    if (data[cryptName] > 0) {
      crypt = data[cryptName];
    }

    if (valCrypt > crypt) {
      alert("Saldo tidak mencukupi");
    } else {

      if ( valCrypt > 0 && this.state.cryptGetRp > 0) {
        rupiah = rupiah + this.state.cryptGetRp;
        crypt = crypt - valCrypt;

        data[cryptName] = crypt;
        data['Rupiah'] = rupiah;

        this.setState({
          ewallet: data,
          cryptGetRp: "0"
        });

        localStorage.setItem("ewallet", JSON.stringify(data));

        document.getElementById("cryptVal").value = "";

        alert("Transaksi berhasil");
      } else {
        alert("Masukkan jumlah yang ingin dijual");
      }
    }
  }

  render() {

    let cryptName = this.state.cryptName;

    return (
      <div className="wrapper">

        <div className="header">
          <div className="logo">
            <h1 className="title">TokoCrypto</h1>
            <p>Jual beli cryptocurrency yang aman dan terpercaya.</p>
          </div>
          <div className="menu">
            <a href="" onClick={e => this.toggleEwallet(e)} className="ewallet-button">eWallet</a>
          </div>
        </div>

        <h2>Top 100 Cryptocurrency in The Market</h2>
        <h6>Tip: click on the column title to sort specifically by asc/desc</h6>

        <table className="crypto-table">
          <thead>
            <tr>
              <th onClick={e => this.handleSort(e, 'rank')} data-sort="desc" title="Sort by Rank">Rank</th>
              <th onClick={e => this.handleSort(e, 'name')} data-sort="asc" title="Sort by Name">Name</th>
              <th onClick={e => this.handleSort(e, 'price_idr')} data-sort="asc" title="Sort by Price">Price</th>
              <th onClick={e => this.handleSort(e, 'percent_change_24h')} data-sort="desc" title="Sort by Change in 24 hour">Change (24 hour)</th>
            </tr>
          </thead>
          <tbody>
            {this.state.cryptos.map((val, key) => {
              let price = val.price_idr;

              let changeClass;

              if (Math.sign(val.percent_change_24h) === -1) {
                changeClass = 'dec';
              } else {
                changeClass = 'inc';
              }

              return (
                <tr key={key} data-price={price} data-name={val.name} onClick={e => this.handleForm(e)}>
                  <td data-title="rank">{val.rank}</td>
                  <td data-title="name" className="name-col">{val.name}</td>
                  <td data-title="price" className="price-col">Rp {parseFloat(price).toLocaleString('id', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  <td data-title="change" className={changeClass}>{val.percent_change_24h}%</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        <div className={ this.state.ewalletShow ? "ewallet show" : "ewallet" }>

          <h2>Your Current Balance</h2>

          <table className="ewallet-table">
            <thead>
              <tr>
                <th>Currency</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {Object.keys(this.state.ewallet).map((key) => {
              if (key === 'Rupiah' || (key !== 'Rupiah' && this.state.ewallet[key] > 0)){
                return (
                    <tr key={key}> 
                      <td>{key}</td>
                      <td>{parseFloat(this.state.ewallet[key]).toLocaleString('id', { minimumFractionDigits: 0, maximumFractionDigits: 15})}</td>
                    </tr>
                );
              } else {
                return (<tr key={key} stlye={{display:"none"}}></tr>);
              }
            })}
            </tbody>
          </table>
          
          <a href="" onClick={e => this.toggleEwallet(e)} className="close-button">CLOSE</a>
        </div>

        <div className={ this.state.formShow ? "transact-form show" : "transact-form" }>
          <h2>{this.state.cryptName}</h2>
          <p>Price: {this.state.cryptPrice} IDR</p>
          <div className="transact-option">
            <a href="" onClick={e => this.toggleTransact(e)} className={ this.state.transactShow ? "buy-tab" : "buy-tab active" }>BUY</a>
            <a href="" onClick={e => this.toggleTransact(e)} className={ this.state.transactShow ? "sell-tab active" : "sell-tab" }>SELL</a>
          </div>
          <div className={ this.state.transactShow ? "buy-form" : "buy-form show" }>
            <p className="balance">Your Rupiah: {this.state.ewallet['Rupiah']}</p>
            <p>Input Rupiah:</p>
            <input id="rupiahVal" type="text" onChange={e => this.handleCalc(e,'buy')} />
            <p>Get {this.state.cryptName}:</p>
            <input type="text" value={this.state.cryptGet} disabled />
            <a href="" onClick={e => this.handleBuy(e)}>BUY</a>
          </div>
          <div className={ this.state.transactShow ? "sell-form show" : "sell-form" }>
            <p className="balance">Your {this.state.cryptName}: {this.state.ewallet[cryptName] ? this.state.ewallet[cryptName] : '0'}</p>
            <p>Input {this.state.cryptName}:</p>
            <input id="cryptVal" type="text" onChange={e => this.handleCalc(e,'sell')} />
            <p>Get Rupiah:</p>
            <input type="text" value={this.state.cryptGetRp} disabled />
            <a href="" onClick={e => this.handleSell(e)}>SELL</a>
          </div>
          <div style={{textAlign:'center'}}><a href="" onClick={e => this.toggleForm(e)} className="close-button">CLOSE</a></div>
        </div>

        <div className={ this.state.overlayShow ? "overlay show" : "overlay" }></div>
      </div>
    );
  }
}

export default App;
