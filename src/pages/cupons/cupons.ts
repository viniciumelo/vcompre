import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Global } from './../../app/global';
import { Http } from '@angular/http';

declare var $;
declare var QRCode;

@IonicPage()
@Component({
  selector: 'page-cupons',
  templateUrl: 'cupons.html',
})
export class CuponsPage {

  cupons:any = [];

  constructor(
    public navCtrl: NavController, 
    public http: Http,
    public Global: Global,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CuponsPage');
    this.obter();
  }

  obter(){
    this.http.get(this.Global.apiURL+'/api/cupons/'+this.Global.userData().id)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      this.cupons = data;
      this.Global.themeInit();
            
      $('#loading').fadeOut(200);
    },
    err => {      
      $('#loading').fadeOut(200);
    }); 
  }

  excluirCupom( id ){

    var self = this;

    var obj = {
      user_id: this.Global.userData().id,
      id: id      
    }

    $.confirm({
      title: 'Atenção!',
      content: 'Você realmente deseja excluir o cupom?',
      buttons: {
          Excluir: function () {
            self.http.post(self.Global.apiURL+'/api/excluir-cupom', obj)
            .map(data => data.json())
            .subscribe(data => {
              console.log(data);  
              
              if (!data.msg) {
                $.alert('Erro ao excluir o cupom. Tente novamente mais tarde.');
              }else{
                self.cupons = data.cupons;
                $.alert('O cupom foi excluído com sucesso.');                
              }
              
              $('#loading').fadeOut(200);
            },
            err => {      
              $('#loading').fadeOut(200);
            });
          },
          Cancelar: function () {}                
      }
    });        
     
  }

  verCupom( item ){
    console.log(item);
    $('#qrcode').empty();
    new QRCode(document.getElementById("qrcode"), item.codigo);
    $('#code').text(item.codigo);
    $('#modal-qrcode').fadeIn(200);
  }

}
