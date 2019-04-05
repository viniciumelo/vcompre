import { Global } from './../../app/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var $;

@IonicPage()
@Component({
  selector: 'page-splash',
  templateUrl: 'splash.html',
})
export class SplashPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public Global: Global) {
  }

  ionViewDidLoad() {
    var self = this;
    $('#logo').fadeIn(1000);
    
    setTimeout(function(){
      $('#loading').fadeIn(200);
    }, 3000);

    setTimeout(function(){            
      self.navCtrl.setRoot('Home');
    }, 3300);
  }

}
