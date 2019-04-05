import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { NgForm } from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Global } from './../../app/global';

declare var $ :any;
@IonicPage()
@Component({
  selector: 'page-cadastro',
  templateUrl: 'cadastro.html',
})
export class CadastroPage {

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    private fb: Facebook,
    public Global: Global) {
  }

  ionViewDidLoad() {         
    setTimeout(()=>   
    $(function(){
        $(".button-collapse").sideNav();                       
    }), 200);

    setTimeout(()=>$('#loading').fadeOut(200), 300);
  } 
  


  pushPage(page){
    $('#loading').show();
    $('.button-collapse').sideNav('hide');
    this.navCtrl.setRoot(page);
  }
  
  pushPageParams(page, params){   
    $('#loading').show();
    $('.button-collapse').sideNav('hide');
    this.navCtrl.setRoot(page, params);
  }


  RegistroSubmit(f: NgForm) {
    console.log(f.value);
    console.log(f.valid);

    var senha = $('#password').val();
    var senha_c = $('#password_confirmation').val();

    if(senha == '' || senha_c == ''){

      $.alert({
        title: 'Atenção!',
          content: 'O campos de senha são obrigatórios.',
          theme: 'modern'
      });

    }else if (senha != senha_c) {
      
      $.alert({
        title: 'Atenção!',
          content: 'Senhas estão divergindo',
          theme: 'modern'
      });

    }else{

      this.http.post(this.Global.apiURL+'/api/registro', f.value)
      .map(data => data.json())
      .subscribe(data => {
  
        console.log(data);
  
        if(!data.id){
          $.alert({
            title: 'Atenção!',
              content: data[Object.keys(data)[0]],
              theme: 'modern'
          });
        }else{
          localStorage.setItem('GuiaDATA', JSON.stringify(data));
                                      
          $('#mascara').fadeOut('100');
          $('#registroPanel').fadeOut('100');
          $('#loginPanel').fadeOut('100');
          $('#sidenav-overlay').click();
          
          $.alert({
            icon: 'fa fa-smile-o',
            theme: 'modern',
            closeIcon: true,
            animation: 'scale',
            type: 'black',
            title: 'Parabéns!!!',
            content: 'Você acabou de se registrar no Aplicativo V Compre Ganhe!',
            
          });
  
          this.pushPageParams('Home', {indice: 0});
          //this.navCtrl.setRoot(this.navCtrl.getActive().component);
  
        }
      },
      err => {
        console.log(err);            
      });
    }


  }

  LoginSubmit(l: NgForm) {
    
    console.log(l.value);  // { first: '', last: '' }
    console.log(l.valid);  // false

    this.http.post(this.Global.apiURL+'/api/login', l.value)
    .map(data => data.json())
    .subscribe(data => {

      console.log(data);

      if(!data.id){
        $.alert({
					title: 'Atenção!',
    				content: data[Object.keys(data)[0]],
				    theme: 'modern'
				});
      }else{
        localStorage.setItem('GuiaDATA', JSON.stringify(data));
        
        $('#mascara').fadeOut('100');
        $('#registroPanel').fadeOut('100');
        $('#loginPanel').fadeOut('100');
        $('#sidenav-overlay').click();
      
        this.pushPageParams('Pagar', {indice: 1});
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);

      }
      
    },
    err => {
      console.log(err);      
    });
      
  }

}
