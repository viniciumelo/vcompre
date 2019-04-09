import { Component, OnInit, Injectable } from '@angular/core';
import { Title, BrowserModule, DomSanitizer } from '@angular/platform-browser';
import { Http } from '@angular/http';
import { Location } from '@angular/common';
import { NgForm } from '@angular/forms';
import 'rxjs/add/operator/map';
import 'rxjs/add/operator/switchMap';
import { LoadingController } from 'ionic-angular';
import { Observable } from 'rxjs/Observable';

declare var $ :any;
declare var lightbox :any;
declare var Materialize :any;

@Injectable()
export class Global {

  public apiURL:string = 'http://vcompreeganhe.com.br';
  public filesURL:string = 'http://vcompreeganhe.com.br/uploads';


  
    // public apiURL:string = 'http://localhost:8000/';
    // public filesURL:string = 'http://localhost:8000/uploads/';
    public AppName:string = '';
    public loja_id:any;
    public lojas:any=[];
    public lat:any;
    public lng:any;
    public fotoPerfil:any;
    public faceData:any;
    public run:any=0;
    public notificacoes:any;
    
    constructor(        
        public http: Http,    
    ) { this.http = http; }   

    themeInit(){
        setTimeout(()=>   
            $(function(){
                
                $(".button-collapse").sideNav();         
            
                $('.slider').slider({
                    height: 250,
                    indicators: true
                });
               $('.slider').slider('pause');
                
                lightbox.option({
                    'resizeDuration': 200,
                    'wrapAround': true
                });  

                $(document).ready(function(){
                    $('ul.tabs').tabs();
                    $('.modal').modal();
                    $('.collapsible').collapsible();                    
                    Materialize.updateTextFields();
                });             
                
        }), 200);
    }
    


    userData()
    {
        if(localStorage.getItem('GuiaDATA')){
            var UserData = JSON.parse(localStorage.getItem('GuiaDATA'));
            return UserData;
        }
        return null;
    }

    formatHoras(value){
        var dateElements = value.split(':');
        var date = new Date();
        date.setHours(dateElements[0]);
        date.setMinutes(dateElements[1]);
        return date;
    }

    converterDay(day){

        if (day == 0)
            return 'Domingo';
        else if (day == 1)
            return 'Segunda';
        else if (day == 2)
            return 'Terça';
        else if (day == 3)
            return 'Quarta';
        else if (day == 4)
            return 'Quinta';
        else if (day == 5)
            return 'Sexta';
        else if (day == 6)
            return 'Sábado';
            
    }

    quebrarLinha( id, texto ){
        var resultado = texto.replace(/\n/ig, '<br/>');
        $('#'+id).html(resultado);
    }

    calcularValor(produto){
        var vlr = produto.valor - ((produto.valor / 100) * produto.desconto);
        return parseFloat( ''+vlr ).toFixed(2);
    }

    distancia(lat1, lon1, lat2,lon2) {
        
        var R = 6371;
        var dLat = (lat2-lat1) * (Math.PI/180);
        var dLon = (lon2-lon1) * (Math.PI/180);
        var a =
          Math.sin(dLat/2) * Math.sin(dLat/2) +
          Math.cos(lat1 * (Math.PI/180)) * Math.cos(lat2 * (Math.PI/180)) *
          Math.sin(dLon/2) * Math.sin(dLon/2);

        var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
        var d = R * c;
        return d;
    }

    sendToken(){
        if(localStorage.getItem('GuiaDATA') && localStorage.getItem('pushToken')){
            var UserData = JSON.parse(localStorage.getItem('GuiaDATA'));          
            this.http.get(this.apiURL+'/api/pushToken/'+UserData['id']+'/'+localStorage.getItem('pushToken'))
            .subscribe(data => { });          
        }
      }
      

    // AuthExist(){
    //     if(!localStorage.getItem('UserId')){
    //         location.href = "/";
    //     }
    //     console.log(localStorage.getItem('UserId'));
    // } 

}
