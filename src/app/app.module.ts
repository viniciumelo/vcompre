import { MensagensPage } from './../pages/mensagens/mensagens';
import { FidelidadePage } from './../pages/fidelidade/fidelidade';
import { BrowserModule } from '@angular/platform-browser';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { HttpModule } from '@angular/http';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

import { Geolocation } from '@ionic-native/geolocation';
import { Facebook } from '@ionic-native/facebook';
import { OneSignal } from '@ionic-native/onesignal';
import { Global } from './global';

import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';
import { LojaPage } from '../pages/loja/loja';
import { ProdutoPage } from '../pages/produto/produto';
import { LoginPage } from '../pages/login/login';
import { PerfilPage } from '../pages/perfil/perfil';
import { CategoriasPage } from './../pages/categorias/categorias';
import { CuponsPage } from './../pages/cupons/cupons';
import { FavoritosPage } from './../pages/favoritos/favoritos';
import { SplashPage } from './../pages/splash/splash';
import { HeaderPage } from './../pages/header/header';
import { PaymentFormPage} from './../pages/payment-form/payment-form';
import { BemvindoPage } from './../pages/bemvindo/bemvindo';
import { CadastroPage } from './../pages/cadastro/cadastro';
import { WalletPage } from './../pages/wallet/wallet';
import { PaymentFinishedPage} from './../pages/payment-finished/payment-finished';
import { BrMaskerModule } from 'brmasker-ionic-3';

@NgModule({
  declarations: [
    MyApp,
    PaymentFinishedPage,
    PaymentFormPage,
    WalletPage,
    CadastroPage,
    BemvindoPage,
    HomePage,
    HeaderPage,
    LojaPage,
    ProdutoPage,
    LoginPage,
    SplashPage,
    FavoritosPage,
    CuponsPage,    
    CategoriasPage,
    PerfilPage,
    FidelidadePage,
    MensagensPage
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    HttpClientModule,
    IonicModule.forRoot(MyApp, {}, {
      links: [
        { component: HomePage, name: 'Home', segment: 'Home' },
        { component: PaymentFormPage, name: 'Pagar', segment: 'Pagar' },
        { component: LojaPage, name: 'Loja', segment: 'Loja' }, 
        { component: ProdutoPage, name: 'Produto', segment: 'Produto' },
        { component: LoginPage, name: 'Login', segment: 'Login' },
        { component: FavoritosPage, name: 'Favoritos', segment: 'Favoritos' },
        { component: CuponsPage, name: 'Cupons', segment: 'Cupons' },        
        { component: CategoriasPage, name: 'Categorias', segment: 'Categorias' },
        { component: PerfilPage, name: 'Perfil', segment: 'Perfil' },
        { component: FidelidadePage, name: 'Fidelidade', segment: 'Fidelidade' },
        { component: MensagensPage, name: 'Mensagens', segment: 'Mensagens' },
        { component: BemvindoPage, name: 'Bemvindo', segment: 'Bemvindo' } ,
        { component: CadastroPage, name: 'Cadastro', segment: 'Cadastro' },
        { component: WalletPage, name: 'Saldo', segment: 'Saldo' }
      ]
    }),
    BrMaskerModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    PaymentFormPage,
    PaymentFinishedPage,
    WalletPage,
    CadastroPage,
    BemvindoPage,
    HomePage,
    LojaPage,
    ProdutoPage,
    LoginPage,
    SplashPage,
    FavoritosPage,
    CuponsPage,    
    CategoriasPage,
    PerfilPage,
    FidelidadePage,
    MensagensPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    Global,
    Facebook,
    Geolocation,
    OneSignal,
    {provide: ErrorHandler, useClass: IonicErrorHandler}
  ]
})
export class AppModule {}
