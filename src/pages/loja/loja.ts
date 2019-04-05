import { Component, ViewChild, ElementRef } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Global } from './../../app/global';

declare var $ :any;
declare var google;
declare var lightbox: any;

@IonicPage()
@Component({
  selector: 'page-loja',
  templateUrl: 'loja.html',
})
export class LojaPage {

  count:any;
  i:any=1;
  active:any=0;
  interval:any;
  count_mapa:any = 0;
  id:any;
  
  loja:any={};
  banners:any;
  ofertas:any;
  
  @ViewChild('mapa') mapaDiv: ElementRef;
  mapa: any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    public Global: Global) {
      this.id = this.navParams.get('id');
      this.Global.loja_id = this.navParams.get('id');
  }
  
  ionViewDidLoad() {    
    this.obter();            
  }

  collapse(id){
    $('#produtos-'+id).toggle();
  }
  
  obter(){

    var user_id = 0;
    if (this.Global.userData() != null) {
      user_id = this.Global.userData().id;
    }

    this.http.get(this.Global.apiURL+'/api/loja-ofertas/'+this.id+'/'+user_id)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      this.loja = data.loja;
      
      if (this.loja.name.length > 22 ) {
        $('#app-name').text( this.loja.name.substring(0,22) + '...' );
      }else{
        $('#app-name').text( this.loja.name );
      }
      $('#app-name').css('font-size','13pt');
      $('#app-name').css('left','42%');


      this.ofertas = data.ofertas;
      this.banners = data.banners;
      this.count = this.banners.length + 1;

      var html = ``;

      this.banners.forEach(item => {
        html += `<li>
                      <a href="`+this.Global.filesURL+`/usuarios/`+item.foto+`" data-lightbox="image-`+item.id+`">
                          <img src="`+this.Global.filesURL+`/usuarios/`+item.foto+`" style="max-width:420px;">
                      </a>
                 </li>`;
      });
      
      if (localStorage.getItem('GuiaLink')) {
        localStorage.removeItem('GuiaLink');
        $(document).ready(function(){
          $('#slides').empty();
          $('#slides').append(html);
          this.Global.themeInit();
        });
      }else{
        $('#slides').empty();
        $('#slides').append(html);
        this.Global.themeInit();
      }

      setTimeout(()=>$('#loading').fadeOut(200), 700);
    },
    err => {
      this.Global.themeInit();
      setTimeout(()=>$('#loading').fadeOut(200), 700);
    }); 
  }  

  carregaMapa() {
    var self = this;
    let coordenadas = new google.maps.LatLng(self.loja.latitude, self.loja.longitude);
    let opcoes = {
      center: coordenadas,
      zoom: 16,
      mapTypeId: google.maps.MapTypeId.ROADMAP
    }
    var marker = new google.maps.Marker({
      position: coordenadas,      
      title: self.loja.name
    });
    self.mapa = new google.maps.Map(self.mapaDiv.nativeElement, opcoes);
    marker.setMap(self.mapa);
  }

  avaliar(){
    
    var atendimento = parseInt($('#atendimento').val());
    var qualidade = parseInt($('#qualidade').val());
    var ambiente = parseInt($('#ambiente').val());    

    var obj = {
      nota_ambiente : ambiente,
      nota_qualidade : qualidade,
      nota_atendimento : atendimento,
      user_id: this.Global.userData().id,
      empresa_id: this.loja.id,
      mensagem: $('#mensagem').val()
    }

    this.http.post(this.Global.apiURL+'/api/avaliar-empresa', obj)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      if (!data.id){
        $.alert({
          title: 'Atenção!',
            content: 'Ocorreu um erro ao tentar avaliar, tente novamente!',
            theme: 'modern'
        });
      }else{
        $.alert({
          title: 'Obrigado!',
            content: 'Sua avaliação foi realizada com sucesso.',
            theme: 'modern'
        });
      }

      $('#atendimento').val(1);
      $('#qualidade').val(1);
      $('#ambiente').val(1);
      $('#mensagem').val('');
      $('#modal-avaliacao').fadeOut(200);
      $('#mascara').hide();

      $('#loading').fadeOut(200);
    },
    err => {
      $('#loading').fadeOut(200);
    }); 
  }

  avaliacao(){
    
    $('#modal-avaliacao').fadeIn(200);
    $('#mascara').show();

    // var obj = {
    //   'id': this.id,
    //   'nome': this.loja.name
    // }
    // this.pushPageParams('Avaliacao', obj);
  }

  pushPage(page){
    $('#loading').show();
    setTimeout(() => this.navCtrl.setRoot(page), 500);    
  }
  
  pushPageParams(page, params){  
    $('#loading').show();
    this.navCtrl.setRoot(page, params);
  }

  getStyleTab(indice){
    let style = {
      'width':'100%',
      'background': '#efefef',
      'margin':'unset',
      'color':'#4A89DC',
      'text-decoration':'none',
      'border-bottom': indice == this.active ? '2px solid' : 'unset'
    };
    return style;
  }

  getStyleDiv(indice){
    let style = {
      'float':'left',
      'display': indice == this.active ? 'block' : 'none',
      'width':'100%',      
    };
    return style;
  }

  clickTab(indice){
    this.active = indice;
    if (indice == 1 && this.count_mapa == 0){
      this.carregaMapa();
      this.count_mapa++;
    }
  }

  favoritar(){

    $('#loading').show();

    var obj = {
      user_id : this.Global.userData().id,
      loja_id : this.id
    }

    this.http.post(this.Global.apiURL+'/api/favoritar-loja', obj)
      .map(data => data.json())
      .subscribe(data => {
  
        console.log(data);        
        $('#loading').fadeOut(200);

        if(data.erro){
          $.alert({
            title: 'Atenção!',
              content: data.erro,
              theme: 'modern'
          });
        }else{
          
          this.loja = data;
          
          $.alert({            
            theme: 'modern',
            closeIcon: true,
            animation: 'scale',
            type: 'black',
            title: '',
            content: this.loja.favorito && this.loja.favorito == 1 ? this.loja.name + ' foi adicionado aos seus favoritos.' : this.loja.name + ' foi removido dos seus favoritos.',
            
          });

        }        
      },
      err => {
        console.log(err);   
        $('#loading').fadeOut(200);         
      });

  }

}
