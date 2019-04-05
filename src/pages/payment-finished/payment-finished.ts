import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

@IonicPage()
@Component({
  selector: 'page-payment-finished',
  templateUrl: 'payment-finished.html',
})
export class PaymentFinishedPage {

  constructor(
    private _navCtrl: NavController,
    private _navParams: NavParams
  ) {
  }

  continue() {

  }

}
