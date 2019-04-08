import { Component, Inject, ViewChild } from '@angular/core';
import { Platform, NavController, NavParams, AlertController  } from 'ionic-angular';
import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';

import { OneSignal } from '@ionic-native/onesignal';
import { Global } from './global';

import { HomePage } from '../pages/home/home';
import { LoginPage } from '../pages/login/login';
import { SplashPage } from './../pages/splash/splash';

declare var $;

@Component({
  templateUrl: 'app.html'
})
export class MyApp {
  
  rootPage:any = LoginPage;
  pushToken:any;    
  @ViewChild('rootNavController') nav: NavController;

  constructor(
    platform: Platform, 
    statusBar: StatusBar, 
    splashScreen: SplashScreen,
    private oneSignal: OneSignal,
    public Global: Global,
  ) {
    var self = this;

    platform.ready().then(() => {

      platform.registerBackButtonAction(function(event){

        var view = self.nav.getActive();
    
        if ( view.component.name == 'LojaPage' || view.component.name == 'FavoritosPage' || 
            view.component.name == 'CuponsPage'){
              $('#loading').show();
              $('.button-collapse').sideNav('hide');
              self.nav.setRoot('Home');
        }          

        if( view.component.name == 'ProdutoPage' || view.component.name == 'AvaliacaoPage' ){
          
          if (this.Global.loja_id) {
            $('#loading').show();
            $('.button-collapse').sideNav('hide');
            self.nav.setRoot('Home',{'id': this.Global.loja_id});
            
          }else{
            $('#loading').show();
            $('.button-collapse').sideNav('hide');
            self.nav.setRoot('Home');
          }
          
        }        

      });      

      if (platform.is('cordova')) {
        this.oneSignal.startInit('52c74b91-44e0-4794-a884-e64d11d52199', '762489166518');
        this.oneSignal.registerForPushNotifications();
        this.oneSignal.getIds().then((ids) => {

          this.pushToken = ids.userId;        
          localStorage.setItem('pushToken', this.pushToken);

          setTimeout(() => { this.Global.sendToken(); }, 2000);
        });

        this.oneSignal.inFocusDisplaying(this.oneSignal.OSInFocusDisplayOption.Notification);
        this.oneSignal.handleNotificationReceived().subscribe(() => {
         // do something when notification is received
        });
        this.oneSignal.handleNotificationOpened().subscribe((data) => {
          // do something when a notification is opened

          if (data.notification.payload.additionalData.loja) {

            if (this.Global.run == 1){
              $('#loading').show();
              $('.button-collapse').sideNav('hide');
              self.nav.setRoot('Loja',{'id': data.notification.payload.additionalData.loja});
            }else{
              localStorage.setItem('GuiaLink', 'Loja-'+data.notification.payload.additionalData.loja);
            }

              
          }else if (data.notification.payload.additionalData.produto) {
            
            if (this.Global.run == 1){
              $('#loading').show();
              $('.button-collapse').sideNav('hide');
              self.nav.setRoot('Produto',{'id': data.notification.payload.additionalData.produto});
            }else{            
              localStorage.setItem('GuiaLink', 'Produto-'+data.notification.payload.additionalData.produto);
            }

              // $('#loading').show();
              // $('.button-collapse').sideNav('hide');
              // self.nav.setRoot('Produto',{'id': data.notification.payload.additionalData.produto});
          }

        });

        this.oneSignal.endInit();
      }
      
      // Okay, so the platform is ready and our plugins are available.
      // Here you can do any higher level native things you might need.
      statusBar.styleDefault();
      //splashScreen.hide();      
    });
  }
}

