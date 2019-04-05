import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Global } from './../../app/global';
import { Http } from '@angular/http';

declare var $;

@Component({
  selector: 'page-mensagens',
  templateUrl: 'mensagens.html',
})
export class MensagensPage {

  mensagens:any;

  constructor(
    public navCtrl: NavController, 
    public http: Http,
    public Global: Global,
    public navParams: NavParams) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad MensagensPage');
    this.obter();    
  }

  obter(){
    this.http.get(this.Global.apiURL+'/api/mensagens/'+this.Global.userData().id)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      this.mensagens = data;      
      this.Global.notificacoes = data.length;
      
      this.Global.themeInit();
            
      $('#loading').fadeOut(200);
    },
    err => {      
      $('#loading').fadeOut(200);
    }); 
  }

  remover(id){
    
    $('#loading').fadeIn(200);

    this.http.post(this.Global.apiURL+'/api/remover-mensagem', {id: id, user_id: this.Global.userData().id})
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      this.mensagens = data;
      this.Global.notificacoes = data.length;
      $.alert({
        title: 'Sucesso!',
          content: 'Notificação foi removida.',
          theme: 'modern'
      });
            
      $('#loading').fadeOut(200);
    },
    err => {     
      $.alert({
        title: 'Atenção!',
          content: 'Não foi possível remover a notificação, tente novamente mais tarde.',
          theme: 'modern'
      }); 
      $('#loading').fadeOut(200);
    }); 
  }

}
