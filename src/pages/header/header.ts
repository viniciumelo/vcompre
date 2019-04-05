import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import { Facebook, FacebookLoginResponse } from '@ionic-native/facebook';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';

import { Global } from './../../app/global';

declare var $ :any;

@IonicPage()
@Component({
  selector: 'page-header',
  templateUrl: 'header.html',
})
export class HeaderPage {  
  
  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    private fb: Facebook,
    public Global: Global) {
      
  }

  ionViewDidLoad() {    
    console.log('ionViewDidLoad HeaderPage');    
  }

  loginFacebook(){
    var self = this;

    this.fb.login(['public_profile', 'user_friends', 'email'])
    .then((res: FacebookLoginResponse) => {
      console.log('Logged into Facebook!', res)

      self.fb.api('me?fields=id,name,email,first_name,picture.width(720).height(720).as(picture_large)', []).then(profile => {
        
        let faceData = {
          email: profile['email'],
          name: profile['first_name'],
          picture: profile['picture_large']['data']['url'],          
          id: profile['id']
        }
        
        self.http.post(self.Global.apiURL+'/api/login-facebook', faceData)
        .map(data => data.json())
        .subscribe(data => {

          console.log(data);

          if(data.erro){
            $.alert({
              title: 'Atenção!',
                content: data.erro,
                theme: 'modern'
            });
          }else{
            localStorage.setItem('GuiaDATA', JSON.stringify(data));                                                                    
            self.pushPageParams('Home', { 'indice': 0 });                        
          }
        },
        err => {
          console.log(err);            
        });
        
      });

    })
    .catch(e => console.log('Error logging into Facebook', e));

    this.fb.logEvent(this.fb.EVENTS.EVENT_NAME_ADDED_TO_CART);
  }  

  checkPage(){
    
    var result = 0;
    var view = this.navCtrl.getActive();

    if ( view.component.name == 'ProdutoPage' || 
         view.component.name == 'LojaPage' ||
         view.component.name == 'FavoritosPage' ||
         view.component.name == 'CuponsPage' ||
         view.component.name == 'ZoopPage' ||
         view.component.name == 'AvaliacaoPage')
      result = 1;
    
    return result;
  }

  back(){
    var view = this.navCtrl.getActive();
    
    if ( view.component.name == 'LojaPage' || view.component.name == 'FavoritosPage' || 
         view.component.name == 'CuponsPage')
      this.pushPage('Home');

    if( view.component.name == 'ProdutoPage' || view.component.name == 'AvaliacaoPage' ){
      
      if (this.Global.loja_id) {
        this.pushPageParams('Loja', {'id': this.Global.loja_id});
      }else{
        this.pushPage('Home');
      }
      
    }

  }

  Sair(){        
    var self = this;
    $.confirm({
        title: 'Atenção!',
        content: 'Você realmente deseja sair do aplicativo?',
        buttons: {
            Sair: function () {

              if ( self.Global.userData().facebook_id ) {
                self.fb.logout();
              }

              localStorage.removeItem('GuiaDATA');
              localStorage.removeItem('GuiaCUPONS');
              self.pushPageParams('Home', {'indice':0});
            },
            Cancelar: function () {}                
        }
    });        
    
}

ordenar(){
  var self = this;
  let content = `
    <form>
      <p>
        <input class="with-gap" name="ordem" type="radio" id="alfa" value="0" checked />
        <label for="alfa">Por ordem alfabética</label>        
      </p>
      <p>
        <input class="with-gap" name="ordem" type="radio" id="prox" value="1" />
        <label for="prox">Por mais próximo</label>        
      </p>
    </form>
  `;

  $.confirm({
    title: 'Ordenar',
    content: content,
    buttons: {
        formSubmit: {
            text: 'Ordenar',
            btnClass: 'blue darken-1',
            action: function () {
                
                var ordem = this.$content.find('input[name=ordem]:checked').val();
                var options = {
                  'indice': 0,
                  'ordem': ordem
                }
                self.pushPageParams('Home', options);
                                
            }
        },
        cancelar: function () {
            //close
        },
    },
    onContentReady: function () {
        // bind to events
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault();
            jc.$$formSubmit.trigger('click'); // reference the button and click it
        });
    }
});
}

pesquisar(q){

  let options = {
    'indice': 1,
    'pesquisa': q
  }
  this.pushPageParams('Home', options);
}  

buscar(){

  var self = this;
  let content = `
    <form action="">
    <div class="input-field col s12" style="margin-bottom:unset;">
        <label class="control-label"><b>Pesquisa</b></label>
        <input id="pesquisa" type="text" name="pesquisa" class="form_input" required>
    </div>
    </form>
  `;

  $.confirm({
    title: 'Buscar',
    content: content,
    buttons: {
        formSubmit: {
            text: 'Buscar',
            btnClass: 'blue darken-1',
            action: function () {
                var name = this.$content.find('#pesquisa').val();
                if(!name){
                    $.alert('Digite uma palavra-chave para sua busca.');
                    return false;
                }

                self.pesquisar(name);
            }
        },
        cancelar: function () {
            //close
        },
    },
    onContentReady: function () {
        // bind to events
        var jc = this;
        this.$content.find('form').on('submit', function (e) {
            // if the user submits the form by pressing enter in the field.
            e.preventDefault();
            jc.$$formSubmit.trigger('click'); // reference the button and click it
        });
    }
});
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

  registroPanel(){
    setTimeout( () => $('#mascara').fadeIn('100'), 500);    
    $('#registroPanel').fadeIn('100');
  }

  loginPanel(){
    $('#loginPanel').fadeIn('100');
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
      
        this.pushPageParams('Home', {indice: 0});
        //this.navCtrl.setRoot(this.navCtrl.getActive().component);

      }
      
    },
    err => {
      console.log(err);      
    });
      
  }

  RecuperarSenhaSubmit(m: NgForm) {
    
    $('#recuperarSenhaPanel').fadeOut('100');
    $('#loading').show();

    console.log(m.value);  // { first: '', last: '' }
    console.log(m.valid);  // false

    this.http.post(this.Global.apiURL+'/api/recuperar-senha', m.value)
    .map(data => data.json())
    .subscribe(data => {

      console.log(data);      
      $('#loading').fadeOut('200');

      if(data.erro){
        $.alert({
					title: 'Atenção!',
    				content: data.erro,
				    theme: 'modern'
				});
      }else{
               
        $.alert({
					title: 'Sucesso!',
    				content: data.sucesso,
				    theme: 'modern'
        });
                
      }
      
    },
    err => {
      console.log(err); 
      $('#loading').fadeOut('200');     
    });
      
  }
   
  
}
