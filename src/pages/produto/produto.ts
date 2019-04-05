import { Http } from '@angular/http';
import { Global } from './../../app/global';
import { Component } from '@angular/core';
import { NgForm } from '@angular/forms';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var $ :any;
declare var lightbox: any;

@IonicPage()
@Component({
  selector: 'page-produto',
  templateUrl: 'produto.html',
})
export class ProdutoPage {  

  config:any={};
  produto:any={};
  fotos:any;
  avaliacoes:any=[];
  count:any;
  id:any;
  likes:any=0;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    public Global: Global) {
      this.id = this.navParams.get('id');
  }

  ionViewDidLoad() {         
    this.obter();    
  }  

  obter(){

    var user_id = 0;
    if (this.Global.userData() != null) {
      user_id = this.Global.userData().id;
    }

    this.http.get(this.Global.apiURL+'/api/produto/'+this.id+'/'+user_id)
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      this.config = data.config;
      this.produto = data.produto;
      this.fotos = data.fotos;
      this.count = this.fotos.length + 1;
      this.avaliacoes = data.avaliacoes;
      this.likes = data.produto.likes;

      var html = ``;

      if (this.fotos.length == 0) {
        html += `<li>
                      <a href="`+this.Global.filesURL+`/produtos/`+this.produto.foto+`" data-lightbox="image-`+this.produto.id+`">
                          <img src="`+this.Global.filesURL+`/produtos/`+this.produto.foto+`" style="max-width:420px;">
                      </a>
                 </li>`;
      }

      this.fotos.forEach(item => {
        html += `<li>
                      <a href="`+this.Global.filesURL+`/produtos/`+item.foto+`" data-lightbox="image-`+item.id+`">
                          <img src="`+this.Global.filesURL+`/produtos/`+item.foto+`" style="max-width:420px;">
                      </a>
                 </li>`;
      });

      // $('#slides').empty();
      // $('#slides').append(html);
      // this.Global.themeInit();
      
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

  comentar(){
    if (this.Global.userData() == null) {
      $.alert({
        title: 'Atenção!',
          content: 'É necessário estar logado para comentar o produto.',
          theme: 'modern'
      });
    }else{
      $('#avaliacao').fadeIn('100');
    }
  }

  baixarCupom(){

    if( this.Global.userData() == null ){

      $.alert({
        title: 'Atenção!',
          content: 'É necessário estar logado para baixar o cupom do produto.',
          theme: 'modern'
      });

    }else{    

      var obj = {
        'user_id': this.Global.userData().id,
        'produto_id': this.produto.id      
      }

      this.http.post(this.Global.apiURL+'/api/baixar-cupom', obj)
      .map(data => data.json())
      .subscribe(data => {
        console.log(data);  
        
        if (data.erro){
          
          $.alert({
            title: 'Erro!',
              content: data.erro,
              theme: 'modern'
          });

        }else{
          
          localStorage.setItem('GuiaCUPONS', JSON.stringify(data.cupons));

          $.alert({
            title: 'Sucesso!',
              content: 'O Cupom foi baixado.',
              theme: 'modern'
          });

        }

        $('#loading').fadeOut(200);
      },
      err => {      
        $('#loading').fadeOut(200);
      });    
    }
  }

  MensagemSubmit(l: NgForm) {
    
    $('#loading').show();
    console.log(l.value);  // { first: '', last: '' }
    console.log(l.valid);  // false

    this.http.post(this.Global.apiURL+'/api/avaliar-produto', l.value)
    .map(data => data.json())
    .subscribe(data => {

      console.log(data);
      this.avaliacoes = data;
      $('#texto').val('');
      $('#avaliacao').fadeOut(200);

      $.alert({
        title: 'Sucesso!',
          content: 'Sua avaliação foi realizada.',
          theme: 'modern'
      });

      $('#loading').fadeOut(200); 
    },
    err => {
      $('#loading').fadeOut(200); 
      console.log(err);      
    });
      
  }

  favoritar(){

    if (this.Global.userData() == null) {
      $.alert({
        title: 'Atenção!',
          content: 'É necessário estar logado para comentar o produto.',
          theme: 'modern'
      });
    }else{
      $('#loading').show();

    var obj = {
      user_id : this.Global.userData().id,
      produto_id : this.id
    }

    this.http.post(this.Global.apiURL+'/api/favoritar-produto', obj)
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
          
          this.produto = data;
          
          $.alert({            
            theme: 'modern',
            closeIcon: true,
            animation: 'scale',
            type: 'black',
            title: '',
            content: this.produto.favorito && this.produto.favorito == 1 ? this.produto.nome + ' foi adicionado aos seus favoritos.' : this.produto.nome + ' foi removido dos seus favoritos.',
            
          });

        }        
      },
      err => {
        console.log(err);   
        $('#loading').fadeOut(200);         
      }); 
    }    
  }

  pushPage(page){
    $('#loading').show();
    setTimeout(() => this.navCtrl.setRoot(page), 500);    
  }
  
  pushPageParams(page, params){  
    $('#loading').show();
    this.navCtrl.setRoot(page, params);
  }

}
