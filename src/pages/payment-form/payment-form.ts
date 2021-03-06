import { Component } from '@angular/core';
import { NavController, AlertController } from 'ionic-angular';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { PaymentFinishedPage } from '../payment-finished/payment-finished';
import { HttpClient } from '@angular/common/http';
import { Global } from './../../app/global';

declare var $;

@Component({
  selector: 'page-payment-form',
  templateUrl: 'payment-form.html'
})
export class PaymentFormPage {
  form: FormGroup;

  sellerId: string = '31c8ee63550640ba8f354f8c863ade8d';
  apiToken: string = 'Basic enBrX3Rlc3RfZ1lmTlU4QUxmSFFEaDk4eWtkMHd1bUlWOg==';
  apiUri: string = 'https://api.zoop.ws/v1/marketplaces/a7736657d5684e2792f4bfb46c431c23';

  constructor(
    private _navCtrl: NavController,
    private _fb: FormBuilder,
    private _alert: AlertController,
    private _http: HttpClient,
    private _global: Global
  ) {
    this.form = this._fb.group({
      payment_type: ['credit', Validators.required],
      card_number: ['', Validators.required],
      expiration: ['', Validators.required],
      holder_name: ['', Validators.required],
      security_code: ['', Validators.required],
      terms: [null, Validators.requiredTrue],
      amount: ['', Validators.required]
    });
  }

  ionViewWillEnter() {
    this._global.themeInit();
    $('#loading').fadeOut(200);
  }

  submit() {
    if (this.form.valid) {
      let expirationPieces = this.form.value['expiration'].split('/');
      let amount = parseInt(this.form.value['amount'].replace(/\D/g, '')) * 100;

      let card = {
        holder_name: this.form.value['holder_name'],
        expiration_month: expirationPieces[0],
        expiration_year: expirationPieces[1],
        card_number: this.form.value['card_number'],
        security_code: this.form.value['security_code']
      };

      this.storeCard(card).subscribe(res => {
        let transaction = {
          amount: amount,
          currency: 'BRL',
          description: 'venda',
          on_behalf_of: this.sellerId,
          token: res['id'],
          payment_type: this.form.value['payment_type']
        };

        this.storeTransaction(transaction).subscribe(tRes => {
          let user = this.getUser();

          if (!user) {
            $.alert({
              title: 'Atenção!',
                content: 'Você não está autenticado, tente novamente.',
                theme: 'modern'
            });
          } else {
            this.storeApi({
              user_id: user['id'],
              transaction_id: tRes['id'],
              transaction_uri: tRes['uri'],
              transaction_status: tRes['status'],
              amount: tRes['amount']
            }).subscribe(aRes => {
              this._navCtrl.setRoot(PaymentFinishedPage);
            }, aErr => {
              $.alert({
                title: 'Atenção!',
                  content: 'Houve um erro ao salvar as informações da transação, tente novamente.',
                  theme: 'modern'
              });
            });
          }
        }, tErr => {
          $.alert({
            title: 'Atenção!',
              content: 'Houve um erro ao processar o seu pagamento, verifique as informações digitadas e tente novamente.',
              theme: 'modern'
          });
        });
      }, err => {
        $.alert({
          title: 'Atenção!',
            content: 'Houve um erro ao salvar as informações do seu pagamento, verifique as informações digitadas e tente novamente.',
            theme: 'modern'
        });
      });
    }
  }

  getUser() {
    let user = localStorage.getItem('GuiaDATA');

    if (user && user != '') {
      return JSON.parse(user);
    }

    return null;
  }

  storeCard(data) {
    return this._http.post(this.apiUri + '/cards/tokens', data, {
      headers: {
        Authorization: this.apiToken
      }
    });
  }

  storeTransaction(data) {
    return this._http.post(this.apiUri + '/transactions', data, {
      headers: {
        Authorization: this.apiToken
      }
    });
  }

  storeApi(data) {
    return this._http.post(this._global.apiURL + '/api/transactions', data);
  }

}
