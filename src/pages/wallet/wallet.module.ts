import { NgModule } from '@angular/core';
import { IonicPageModule } from 'ionic-angular';
import { WalletPage } from './wallet';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    WalletPage,
  ],
  imports: [
    IonicPageModule.forChild(WalletPage),
    BrMaskerModule
  ],
})
export class WalletPageModule {}
