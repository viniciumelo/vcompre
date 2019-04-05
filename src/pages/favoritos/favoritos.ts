import { Global } from './../../app/global';
import { Http } from '@angular/http';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var $;

@IonicPage()
@Component({
  selector: 'page-favoritos',
  templateUrl: 'favoritos.html',
})
export class FavoritosPage {

  favoritos:any = [];
  ofertas:any = [];

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public Global: Global,
    public http: Http) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad FavoritosPage');
    this.obter();
  }

  pushPage(page){
    $('#loading').show();
    this.navCtrl.setRoot(page);
  }
  
  pushPageParams(page, params){  
    $('#loading').show();
    this.navCtrl.setRoot(page, params);
  }

  obter(){
    this.Global.themeInit();
    this.http.get(this.Global.apiURL+'/api/favoritos/'+this.Global.userData().id)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      this.favoritos = data.lojas;
      this.ofertas = data.ofertas;      
            
      $('#loading').fadeOut(200);
    },
    err => {      
      $('#loading').fadeOut(200);
    }); 
  }

}
