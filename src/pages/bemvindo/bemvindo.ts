import { NgForm } from '@angular/forms';
import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams } from 'ionic-angular';
import { Http } from '@angular/http';
import { Global } from '../../app/global';

declare var $;

@IonicPage()
@Component({
  selector: 'page-bemvindo',
  templateUrl: 'bemvindo.html',
})
export class  BemvindoPage {

  usuario:any={};
  files:any;
  imagem:any;

  constructor(
    public navCtrl: NavController, 
    public navParams: NavParams,
    public http: Http,
    public Global: Global) {      
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PerfilPage');
    this.Global.themeInit();    
    this.usuario = this.Global.userData();

    if (this.usuario.notificacao == 1) {
      $('#filled-in-box').prop('checked','checked');
    }

    console.log(this.usuario);    
    setTimeout(()=>$('#loading').fadeOut(200), 700);    

    setTimeout(() => {
      var self = this;
      $('form#foto-form').submit(function(e){
        e.preventDefault();
        //$('.loading-mask').removeClass('stop-loading');
        //alert('indo');
          var formData = new FormData(this);
          formData.append('id', self.Global.userData().id);
          console.log(formData);

          $.ajax({
              type:'POST',
              url: self.Global.apiURL+'api/update-foto-perfil',
              data:formData,
              cache:false,
              contentType: false,
              processData: false,
              success:function(data){
                  console.log(data);
                  self.usuario = data;
                  localStorage.setItem('GuiaDATA', JSON.stringify(data));
                  $('#foto_perfil').attr('src', self.Global.apiURL+'uploads/usuarios/'+data.foto);

                  $('.loading-mask').addClass('stop-loading');
                  $.alert({
                    title: 'Sucesso!',
                      content: 'Foto do perfil alterada!',
                      theme: 'modern'
                  });

              },
              error: function(data){
                  console.log("error");
                  console.log(data);
              }
          });
      });
    }, 1000)
  }  

  perfilSubmit(l: NgForm) {        

    l.value.id = this.Global.userData().id;
    l.value.sexo = $('input:checked').val();    

    if ( $('.filled-in').is(':checked') ) {
      l.value.notificacao = 1;
    }else {
      l.value.notificacao = 0;
    }

    console.log(l.value);  // { first: '', last: '' }
    console.log(l.valid);  // false

    this.http.post(this.Global.apiURL+'/api/update-perfil', l.value)
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

        $.alert({
					title: 'Sucesso!',
    				content: 'Seus dados foram atualizados.',
				    theme: 'modern'
        });
      }
      
    },
    err => {
      console.log(err);      
    });
      
  }

  FotoSubmit(){
    
    var f = {      
      id : this.Global.userData().id,
      foto : this.imagem
    }

    $('#loading').show();
    
      this.http.post(this.Global.apiURL+'/api/update-foto-perfil', f)
      .map(data => data.json())
      .subscribe(data => {
        console.log(data);

        if (data.erro){

          $.alert({
            title: 'Atençao!',
              content: data.erro,
              theme: 'modern'
          });

        }else{
          this.usuario = data;
          this.imagem = null;
          localStorage.setItem('GuiaDATA', JSON.stringify(data));

          $.alert({
            title: 'Sucesso!',
              content: 'Foto do perfil alterada!',
              theme: 'modern'
          });
        }

        this.Global.fotoPerfil = data.foto;

        $('#loading').fadeOut(200);

      });   

  }

  getFilesMultiples(event){
    console.log(event);
      this.files = event.target.files;
      for(var i=0;i<event.target.files.length;i++){
        var reader = new FileReader(); 
        reader.onload = this._handleReaderLoadedM.bind(this); 
        reader.readAsBinaryString(this.files[i]);
      }
      //this.FotoSubmit();
  }
  _handleReaderLoadedM(readerEvt) {
      var binaryString = readerEvt.target.result; 
      var filestring = btoa(binaryString);  // Converting binary string data.
      this.imagem = filestring;
      this.FotoSubmit();
      console.log(this.imagem);
  }

}
