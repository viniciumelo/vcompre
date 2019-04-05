import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Global } from '../../app/global';
import { Geolocation } from '@ionic-native/geolocation';
import { SplashScreen } from '@ionic-native/splash-screen';
import { LoadingController } from 'ionic-angular/components/loading/loading-controller';

declare var $ :any;
declare var lightbox: any;

@Component({
  selector: 'page-home',
  templateUrl: 'home.html'
})
export class HomePage {
  
  active:any=0;
  //lojas:any=[];
  ofertas:any=[];
  banners:any=[];
  // lat:any;
  // lng:any;  
  categoria_id:any;
  categoria_nome:any;
  pesquisa:any;
  ordem:any;
  faceData:any;
  tipo:any;
  
  page_ofertas:any=1;
  semaforoOfertas:any=false;
  fim_ofertas:any=false;

  page_lojas:any=1;
  semaforoLojas:any=false;
  fim_lojas:any=false;

  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public http: Http,
    private geolocation: Geolocation,
    public Global: Global,
    public loadingCtrl: LoadingController,
    splashScreen: SplashScreen,    
  ) {            

    $('#loading').show();    

    this.active = this.navParams.get('indice');
    this.pesquisa = this.navParams.get('pesquisa');
    this.ordem = this.navParams.get('ordem');
    this.categoria_id = this.navParams.get('categoria_id');
    this.categoria_nome = this.navParams.get('categoria_nome');
    this.tipo = this.navParams.get('tipo');
    this.faceData = this.navParams.get('faceData');
    
    splashScreen.hide();

    if (localStorage.getItem('GuiaLink')){
      var link = localStorage.getItem('GuiaLink');
      var arr = link.split('-');            
      this.pushPageParams(arr[0], { id: arr[1] });
    }
  }
  
  ionViewDidLoad() {             

    //alert( 'pushToken: ' + localStorage.getItem('pushToken') );

    this.Global.run = 1;
    this.Global.sendToken();

    console.log(this.tipo);
    console.log(this.categoria_id);
    console.log(this.categoria_nome);

    var self = this;
    this.geolocation.getCurrentPosition().then((resp) => {

      console.log(resp.coords.latitude + ' - ' + resp.coords.longitude);

      self.Global.lat = resp.coords.latitude;
      self.Global.lng = resp.coords.longitude;

     }).catch((error) => {
        
        // $.alert({
        //     title: 'Atenção!',
        //     content: 'Ative o seu GPS para localizar lojas próximas a você!',
        //     theme: 'modern'
        // });

       console.log('Error getting location', error);
     });

     this.obter();
     if (this.Global.userData()) this.qtd_mensagens();

     var self = this;
     $(window).scroll(function() {
        if($(window).scrollTop() + $(window).height() == $(document).height()) {
          
          var view = self.navCtrl.getActive();
          
          
          if ( !self.fim_ofertas && self.active == 1 && view.component.name == 'HomePage' && !self.semaforoOfertas){
            console.log(self.active + ' - ofertas - ' + self.fim_ofertas);
            self.semaforoOfertas = true;
            ++self.page_ofertas;
            self.obterMaisOfertas( self.page_ofertas );
          }else if ( !self.fim_lojas && (!self.active || self.active == 0) && view.component.name == 'HomePage' && !self.semaforoLojas ) {
            console.log(self.active + ' - - ' + self.fim_ofertas);
            self.semaforoLojas = true;
            ++self.page_lojas;
            self.obterMaisLojas( self.page_lojas );
          }
        }
    });
  }

  changeTab( indice ){
    this.active = indice;
  }

  obter() : Promise<any> {
    return new Promise(() => {    
    var self = this;
    if (this.categoria_id) {

      this.http.get(this.Global.apiURL+'/api/index/'+this.categoria_id+'/'+this.tipo)
      .map(data => data.json())
      .subscribe(data => {
        console.log(data);  
        
        if (data.lojas) {
          this.Global.lojas = data.lojas;
          this.ofertas = null;
        }else if (data.ofertas) {
          this.Global.lojas = null;
          this.ofertas = data.ofertas;        
        }
        
        this.Global.themeInit();                
        setTimeout(()=>$('#loading').fadeOut(200), 700);
      },
      err => {
        this.Global.themeInit();
        setTimeout(()=>$('#loading').fadeOut(200), 700);
      }); 

    }else if (this.pesquisa) {

      this.http.get(this.Global.apiURL+'/api/index-pesquisa/'+this.pesquisa)
      .map(data => data.json())
      .subscribe(data => {
        console.log(data);  
        
        this.Global.lojas = data.lojas;
        this.ofertas = data.ofertas;        
        
        this.Global.themeInit();
        setTimeout(()=>$('#loading').fadeOut(200), 700);
      },
      err => {
        this.Global.themeInit();
        setTimeout(()=>$('#loading').fadeOut(200), 700);
      }); 

    }else if (this.ordem){

      console.log(this.Global.lat);
      console.log(this.Global.lng);

      var obj = {
        latitude: self.Global.lat,
        longitude: self.Global.lng,
        ordem: this.ordem
      }

      this.http.post(this.Global.apiURL+'/api/index-ordenar', obj)
      .map(data => data.json())
      .subscribe(data => {
        console.log(data);  
        
        this.Global.lojas = data.lojas;
        this.ofertas = data.ofertas;
        this.banners = data.banners;

        var html = ``;

        this.banners.forEach(item => {
          html += `<li>
                        <a id="link-`+ item.id +`">
                            <img src="`+this.Global.filesURL+`/usuarios/`+item.foto+`"  style=" background-position: center;
                            background-size:100% 250px;
                            background-repeat: no-repeat;">
                        </a>
                  </li>`;
        });

        $('#slides').empty();
        $('#slides').append(html);        
        this.Global.themeInit();
        this.configurarBanners();

        setTimeout(()=>$('#loading').fadeOut(200), 700);
      },
      err => {
        this.Global.themeInit();
        setTimeout(()=>$('#loading').fadeOut(200), 700);
      }); 

    }else{

      this.http.get(this.Global.apiURL+'/api/index')
      .map(data => data.json())
      .subscribe(data => {
        console.log(data);  
        
        this.Global.lojas = data.lojas;
        this.ofertas = data.ofertas;
        this.banners = data.banners;

        var html = ``;

        this.banners.forEach(item => {
          html += `<li>
                        <a id="link-`+ item.id +`">
                            <img src="`+this.Global.filesURL+`/usuarios/`+item.foto+`"  style=" background-position: center;
                            background-size:100% 250px;
                            background-repeat: no-repeat;">
                        </a>
                  </li>`;
        });

        $('#slides').empty();
        $('#slides').append(html);
        this.Global.themeInit();
        this.configurarBanners();

        setTimeout(()=>$('#loading').fadeOut(200), 700);
      },
      err => {
        this.Global.themeInit();
        setTimeout(()=>$('#loading').fadeOut(200), 700);
      }); 
    }  
    });  
  }  
  
  obterMaisOfertas( page ){

    $('#processando').show();

    //buscar um loading para carregar mais ofertas
    this.http.get(this.Global.apiURL+'/api/obter-mais-ofertas?page='+page)
      .map(data => data.json())
      .subscribe(data => {
        //console.log(data);

        if (data.length == 0) {
          this.fim_ofertas = true;
        }

        data.forEach(e => {          
          this.ofertas.push(e);        
        });
        
        this.semaforoOfertas = false;
        $('#processando').hide();        
        console.log(this.ofertas);        
      },
      err => {
        $('#processando').hide();
      }); 
  }

  obterMaisLojas( page ){

    $('#processando').show();

    //buscar um loading para carregar mais ofertas
    this.http.get(this.Global.apiURL+'/api/obter-mais-lojas?page='+page)
      .map(data => data.json())
      .subscribe(data => {
        //console.log(data);

        if (data.length == 0) {
          this.fim_lojas = true;
        }

        data.forEach(e => {          
          this.Global.lojas.push(e);        
        });
        
        this.semaforoLojas = false;
        $('#processando').hide();        
        console.log(this.Global.lojas);        
      },
      err => {
        $('#processando').hide();
      }); 
  }

  configurarBanners(){
    var self = this;
    this.banners.forEach(item => {
      $('#link-'+item.id).click(function(){        

        if (item.tipo == 0) {
          self.pushPageParams('Loja',{'id':item.link});
        }else if (item.tipo == 1) {
          self.pushPageParams('Produto',{'id':item.link});
        }else if (item.tipo == 2) {
          let params = {
            'indice': 0,
            'categoria_id': item.link,
            'categoria_nome': '#vazio#',
            'tipo': 0
          }
          self.pushPageParams('Home', params);
        }else if (item.tipo == 3) {
          let params = {
            'indice': 1,
            'categoria_id': item.link,
            'categoria_nome': '#vazio#',
            'tipo': 1
          }
          self.pushPageParams('Home', params);
        }else if (item.tipo == 4) {
          window.open(item.link,'_system');
        }

        //console.log('#link-'+item.id);
        //self.pushPageParams('Loja',{'id':item.link});
      });
    });
  }

  removerCategoria(){
    this.pushPageParams('Home', {'indice':0});
  }

  calcularDistancia(loja){
    if (loja.latitude && loja.longitude) {
      var d = this.Global.distancia(this.Global.lat, this.Global.lng, loja.latitude, loja.longitude);
      return parseFloat(''+d).toFixed(2);
    }else{
      return parseFloat('0').toFixed(2);
    }
  }

  pushPage(page){
    $('#loading').show();
    this.navCtrl.setRoot(page);
  }
  
  pushPageParams(page, params){  
    $('#loading').show();  
    this.navCtrl.setRoot(page, params);
  }

  getClass(indice){
    let class_;
    
    if (indice == this.active)
      class_ = ['active'];

    return class_;
  }

  qtd_mensagens(){
    this.http.get(this.Global.apiURL+'/api/quantidade-mensagens/'+this.Global.userData().id)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);        
      this.Global.notificacoes = data;            
    },
    err => {      
      
    }); 
  }

}
