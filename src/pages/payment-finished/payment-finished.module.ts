import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { PaymentFinishedPage } from './payment-finished';

@NgModule({
  declarations: [
    PaymentFinishedPage,
  ],
  imports: [
    IonicPageModule.forChild(PaymentFinishedPage),
  ],
})
export class PaymentFinishedPageModule {}
