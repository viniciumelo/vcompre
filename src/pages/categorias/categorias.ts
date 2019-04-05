import { Http } from '@angular/http';
import { Global } from './../../app/global';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';

declare var $;

@IonicPage()
@Component({
  selector: 'page-categorias',
  templateUrl: 'categorias.html',
})
export class CategoriasPage {

  categorias:any=[];
  categorias_empresa:any=[];
  titulo:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    public Global: Global) {
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad CategoriasPage');
    this.obter();
  }

  obter(){
    this.Global.themeInit();
    this.http.get(this.Global.apiURL+'/api/categorias')
    .map(data => data.json())
    .subscribe(data => {
      console.log(data);  
      
      this.categorias = data.categorias;
      this.categorias_empresa = data.categorias_empresa;      
            
      $('#loading').fadeOut(200);
    },
    err => {      
      $('#loading').fadeOut(200);
    }); 
  }

  collapse(id){
    $('#list-'+id).toggle();
  }

  filtrarLoja(item){
    let params = {
      'indice': 0,
      'categoria_id': item.id,
      'categoria_nome': item.nome,
      'tipo': 0
    }
    this.pushPageParams('Home', params);
  }
  
  filtrarOferta(item){
    let params = {
      'indice': 1,
      'categoria_id': item.id,
      'categoria_nome': item.nome,
      'tipo': 1
    }
    this.pushPageParams('Home', params);
  }

  pushPage(page){
    $('#loading').show();
    this.navCtrl.setRoot(page);
  }
  
  pushPageParams(page, params){   
    $('#loading').show();
    this.navCtrl.setRoot(page, params);
  }

}
