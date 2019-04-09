import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';
import { Global } from './../../app/global';

declare var $;

@IonicPage()
@Component({
  selector: 'page-wallet',
  templateUrl: 'wallet.html',
})
export class WalletPage {
  currentStore: any = {
    id: 0,
    empresa: {
      name: 'Nenhuma rede selecionada'
    }
  };

  points: any = {
    0: {
      points: 0,
      available_points: 0,
      cashback: 0
    }
  };

  stores: any = [
    {
      id: 0,
      empresa: {
        name: 'Nenhuma rede selecionada'
      }
    }
  ];

  withdraw: any = {
    points: 0,
    cashback: 0.00
  };

  user: any = {
    id: 0
  };

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams,
    private _http: HttpClient,
    private _alert: AlertController,
    private _global: Global
  ) {
    if (this.getUser()) {
      this.user = this.getUser();
    }
  }

  ionViewWillEnter() {
    this.obter();
    this.getWallet();
  }

  obter() {
    this._global.themeInit();
    $('#loading').fadeOut(200);
  }

  getWallet() {
    this._http.get(this._global.apiURL + '/api/wallets/' + this.user['id']).subscribe(res => {
      this.stores = res['data']['stores'];
      this.points = res['data']['points'];

      if (this.stores && this.stores.length != 0) {
        this.currentStore = this.stores[0];
      }
    }, err => {
      $.alert({
        title: 'Atenção!',
          content: 'Houve um erro ao obter o seu saldo, tente novamente.',
          theme: 'modern'
      });
    });
  }

  continue() {
    if (this.withdraw.points > 0 && this.withdraw.cashback > 0) {

    }
  }

  getUser() {
    let user = localStorage.getItem('GuiaDATA');

    if (user && user != '') {
      return JSON.parse(user);
    }

    return null;
  }
}
