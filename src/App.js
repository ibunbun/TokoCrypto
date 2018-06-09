import React, { Component } from 'react';
import Header from './component/Header.js';
import Cryptotable from './component/Cryptotable.js';
import Ewallet from './component/Ewallet.js';
import Transactform from './component/Transactform.js';
import './css/reset.css';
import './css/App.css';

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

  toggleEwallet = (e) => {
    e.preventDefault();
    let ewalletShow = !this.state.ewalletShow;
    let overlayShow = !this.state.overlayShow;
    this.setState({ ewalletShow: ewalletShow, overlayShow: overlayShow });
  }

  toggleForm = (e) => {
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

  toggleTransact = (e) => {
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

  handleSort = (sortKey) => (e) => {
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

  handleForm = (e) => {
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

  handleCalc = (transact) => (e) => {
    let value = e.currentTarget.value;
    let price = this.state.cryptPrice;

    if (Math.sign(value) === 1 && Math.sign(price) === 1){

      value = parseFloat(value);
      price = parseFloat(price);
      
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

  handleBuy = (e) => {
    e.preventDefault();
    let rupiah = parseFloat(this.state.ewallet['Rupiah']);
    let valRupiah = parseFloat(document.getElementById("rupiahVal").value);
    let cryptName = this.state.cryptName;

    if (valRupiah > rupiah) {
      alert("Saldo tidak mencukupi.");
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

        let msg = "Selamat transaksi Anda berhasil.\nSaldo Rupiah Anda saat ini: " + rupiah + "\nSaldo " + cryptName + " Anda saat ini: " + data[cryptName];

        alert(msg);
      } else {
        alert("Masukkan jumlah rupiah.");
      }
    }
  }

  handleSell = (e) => {
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
      alert("Saldo tidak mencukupi.");
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

        let msg = "Selamat transaksi Anda berhasil.\nSaldo Rupiah Anda saat ini: " + rupiah + "\nSaldo " + cryptName + " Anda saat ini: " + crypt;

        alert(msg);
      } else {
        alert("Masukkan jumlah yang ingin dijual.");
      }
    }
  }

  render() {

    return (
      <div className="wrapper">

        <Header toggleEwallet={this.toggleEwallet} />

        <Cryptotable
          handleSort={this.handleSort}
          handleForm={this.handleForm}
          cryptos={this.state.cryptos}
        />

        <Ewallet
          ewalletShow={this.state.ewalletShow}
          ewallet={this.state.ewallet}
          toggleEwallet={this.toggleEwallet}
        />

        <Transactform
          ewallet={this.state.ewallet}
          cryptName={this.state.cryptName}
          cryptPrice={this.state.cryptPrice}
          cryptGet={this.state.cryptGet}
          cryptGetRp={this.state.cryptGetRp}
          toggleTransact={this.toggleTransact}
          toggleForm={this.toggleForm}
          formShow={this.state.formShow}
          transactShow={this.state.transactShow}
          handleCalc={this.handleCalc}
          handleBuy={this.handleBuy}
          handleSell={this.handleSell}
        />

        <div className={ this.state.overlayShow ? "overlay show" : "overlay" }></div>
      </div>
    );
  }
}

export default App;
