import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, LoadingController } from 'ionic-angular';
import { HttpClient } from '@angular/common/http';

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

  stores: any = [];

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
    private _loading: LoadingController
  ) {
    if (this.getUser()) {
      this.user = this.getUser();
    }
  }

  ionViewWillEnter() {
    this.getWallet();
  }

  getWallet() {
    let loading = this._loading.create({content: 'Carregando...'});
    loading.present();

    this._http.get('http://127.0.0.1:8000/api/wallets/' + this.user['id']).subscribe(res => {
      loading.dismiss();

      this.stores = res['data']['stores'];
      this.points = res['data']['points'];

      if (this.stores && this.stores.length != 0) {
        this.currentStore = this.stores[0];
      }
    }, err => {
      loading.dismiss();

      this._alert.create({
        title: 'Erro',
        subTitle: 'Houve um erro ao obter o seu saldo, tente novamente.',
        buttons: ['OK']
      }).present();
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
