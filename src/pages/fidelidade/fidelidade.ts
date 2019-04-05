import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Global } from './../../app/global';
import { Http } from '@angular/http';

declare var $;
declare var Array;

@Component({
  selector: 'page-fidelidade',
  templateUrl: 'fidelidade.html',
})
export class FidelidadePage {

  fidelidades:any;
  cartao:any;

  constructor(
    public navCtrl: NavController, 
    public http: Http,
    public Global: Global,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {    
    this.obter();
  }

  obter(){
    this.http.get(this.Global.apiURL+'/api/fidelidades/'+this.Global.userData().id)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      this.fidelidades = data;
      
      this.Global.themeInit();
            
      $('#loading').fadeOut(200);
    },
    err => {      
      $('#loading').fadeOut(200);
    }); 
  }

  range( qtd_assinaturas ){
    var arr = [];
    for(var i = 0; i < qtd_assinaturas; i++){
      arr.push(i+1);
    }    
    return arr;
  }

  excluirCartao( id ){    

    var self = this;

    var obj = {
      user_id: this.Global.userData().id,
      loja_id: id
    }

    $.confirm({
      title: 'Atenção!',
      content: 'Você realmente deseja excluir o seu cartão fidelidade?',
      buttons: {
          Excluir: function () {
            self.http.post(self.Global.apiURL+'/api/excluir-fidelidade', obj)
            .map(data => data.json())
            .subscribe(data => {
              console.log(data);  
              
              if (!data.msg) {
                $.alert('Erro ao excluir o cartão fidelidade. Tente novamente mais tarde.');
              }else{
                self.fidelidades = data.fidelidades;
                $.alert('O seu cartão fidelidade foi excluído com sucesso.');                
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
    this.cartao = item;
    console.log(item);    
    $('#modal-qrcode').fadeIn(200);
  }

}
