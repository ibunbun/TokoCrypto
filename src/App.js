import React, { Component } from 'react';
import Cryptos from './component/Cryptos.js';
import './css/reset.css';
import './css/App.css';

class App extends Component {
  constructor() {
    super();
    // Set initial state
    this.state = {
      ewallet: {'Rupiah':'10000000'},
      cryptName: '',
      cryptPrice: '0',
      cryptGet: '0',
      cryptGetRp: '0',
      ewalletShow: false,
      formShow: false,
      overlayShow: false,
      transactShow: false
    };
  }

  componentDidMount() {
    // Check for data in local storage then put it into state
    let localEwallet = localStorage.getItem('ewallet');
    if (localEwallet) {
      localEwallet = JSON.parse(localEwallet);
      this.setState({
        ewallet : localEwallet
      });
    }
  }

  /* Hide/show eWallet pop up */
  toggleEwallet = (e) => {
    e.preventDefault();
    let ewalletShow = !this.state.ewalletShow;
    let overlayShow = !this.state.overlayShow;
    this.setState({ ewalletShow: ewalletShow, overlayShow: overlayShow });
  }

  /* Hide/show transaction form pop up */
  toggleForm = (e) => {
    e.preventDefault();
    let formShow = !this.state.formShow;
    let overlayShow = !this.state.overlayShow;
    this.setState({ 
      formShow: formShow,
      overlayShow: overlayShow,
      cryptGet: '0',
      cryptGetRp: '0'
    });
    // Clear input box
    document.getElementById("cryptVal").value = "";
    document.getElementById("rupiahVal").value = "";
  }

  /* Hide/show buy and sell form */
  toggleTransact = (e) => {
    e.preventDefault();
    let transactShow = !this.state.transactShow;
    this.setState({ 
      transactShow: transactShow,
      cryptGet: '0',
      cryptGetRp: '0'
    });
    // Clear input box
    document.getElementById("cryptVal").value = "";
    document.getElementById("rupiahVal").value = "";
  }

  /* Prefill info on form for clicked cryptocurrency */
  handleForm = (e) => {
    let name = e.currentTarget.dataset['name'];
    let price = e.currentTarget.dataset['price'];
    this.setState({
      cryptName: name,
      cryptPrice: price
    })
    this.toggleForm(e);
  }

  /**
   * Calculate rupiah/crypto conversion
   * @param (string) transact [buy or sell]
   */
  handleCalc = (transact) => (e) => {
    let inputVal = e.currentTarget.value;
    let price = this.state.cryptPrice;

    // Validate positive value
    if (Math.sign(inputVal) === 1 && Math.sign(price) === 1){

      // Convert string to number
      inputVal = parseFloat(inputVal);
      price = parseFloat(price);
      
      if (transact === 'buy') {

        // Calculate how many crypto user will get
        let get = inputVal/price;

        this.setState({
          cryptGet: get
        })
      } else {

        // Calculate how many rupiah user will get
        let get = price * inputVal;

        this.setState({
          cryptGetRp: get
        })
      }
    } else {
      // Clear conversion box
      this.setState({
        cryptGet: '0',
        cryptGetRp: '0'
      })
    }
  }

  /* Process buying cryptocurrency */
  handleBuy = (e) => {
    e.preventDefault();
    let rupiah = parseFloat(this.state.ewallet['Rupiah']);
    let valRupiah = parseFloat(document.getElementById("rupiahVal").value);
    let cryptName = this.state.cryptName;

    if (valRupiah > rupiah) {
      alert("Saldo tidak mencukupi.");
    } else {
      if ( valRupiah > 0 && this.state.cryptGet > 0) {

        let data = this.state.ewallet;
        rupiah = rupiah - valRupiah;
        data['Rupiah'] = rupiah;

        // Check if crypto already exist in user's eWallet
        if (data[cryptName] > 0) {
          // Update crypto amount
          data[cryptName] = data[cryptName] + this.state.cryptGet;
        } else {
          // Insert new crypto
          data[cryptName] = this.state.cryptGet;
        }
        
        this.setState({
          ewallet: data,
          cryptGet: "0"
        });

        // Update user's eWallet local storage
        localStorage.setItem("ewallet", JSON.stringify(data));

        // Clear input box
        document.getElementById("rupiahVal").value = "";

        let msg = "Selamat transaksi Anda berhasil.\nSaldo Rupiah Anda saat ini: " + rupiah + "\nSaldo " + cryptName + " Anda saat ini: " + data[cryptName];

        alert(msg);
      } else {
        alert("Masukkan jumlah rupiah.");
      }
    }
  }

  /* Process selling cryptocurrency */
  handleSell = (e) => {
    e.preventDefault();
    let rupiah = parseFloat(this.state.ewallet['Rupiah']);
    let valCrypt = parseFloat(document.getElementById("cryptVal").value);
    let cryptName = this.state.cryptName;

    let data = this.state.ewallet;
    let crypt = 0;

    // Check if crypto exist in user's eWallet
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

        // Update user's eWallet local storage
        localStorage.setItem("ewallet", JSON.stringify(data));

        // Clear input box
        document.getElementById("cryptVal").value = "";

        let msg = "Selamat transaksi Anda berhasil.\nSaldo Rupiah Anda saat ini: " + rupiah + "\nSaldo " + cryptName + " Anda saat ini: " + crypt;

        alert(msg);
      } else {
        alert("Masukkan jumlah yang ingin dijual.");
      }
    }
  }

  render() {
    let cryptName = this.state.cryptName;
    return (
      <div className="wrapper">

        {/* Header */}
        <div className="header">
          <div className="logo">
            <h1 className="title">TokoCrypto</h1>
            <p>Jual beli cryptocurrency yang aman dan terpercaya.</p>
          </div>
          <div className="menu">
            <a href="" onClick={this.toggleEwallet} className="ewallet-button">eWallet</a>
          </div>
        </div>

        {/* List of cryptocurrency */}
        <Cryptos handleForm={this.handleForm} />

        {/* eWallet pop up */}
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
          <a href="" onClick={this.toggleEwallet} className="close-button">CLOSE</a>
        </div>

        {/* Transaction form pop up */}
        <div className={ this.state.formShow ? "transact-form show" : "transact-form" }>
          <h2>{this.state.cryptName}</h2>
          <p>Price: {this.state.cryptPrice} IDR</p>
          <div className="transact-option">
            <a href="" onClick={this.toggleTransact} className={ this.state.transactShow ? "buy-tab" : "buy-tab active" }>BUY</a>
            <a href="" onClick={this.toggleTransact} className={ this.state.transactShow ? "sell-tab active" : "sell-tab" }>SELL</a>
          </div>
          <div className={ this.state.transactShow ? "buy-form" : "buy-form show" }>
            <p className="balance">Your Rupiah: {this.state.ewallet['Rupiah']}</p>
            <p>Input Rupiah:</p>
            <input id="rupiahVal" type="number" onChange={this.handleCalc('buy')} />
            <p>Get {this.state.cryptName}:</p>
            <input type="text" value={this.state.cryptGet} disabled />
            <a href="" onClick={this.handleBuy}>BUY</a>
          </div>
          <div className={ this.state.transactShow ? "sell-form show" : "sell-form" }>
            <p className="balance">Your {this.state.cryptName}: {this.state.ewallet[cryptName] ? this.state.ewallet[cryptName] : '0'}</p>
            <p>Input {this.state.cryptName}:</p>
            <input id="cryptVal" type="number" onChange={this.handleCalc('sell')} />
            <p>Get Rupiah:</p>
            <input type="text" value={this.state.cryptGetRp} disabled />
            <a href="" onClick={this.handleSell}>SELL</a>
          </div>
          <div style={{textAlign:'center'}}><a href="" onClick={this.toggleForm} className="close-button">CLOSE</a></div>
        </div>

        <div className={ this.state.overlayShow ? "overlay show" : "overlay" }></div>
      </div>
    );
  }
}

export default App;
