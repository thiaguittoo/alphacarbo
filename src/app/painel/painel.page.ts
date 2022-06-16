import { Component, OnInit } from '@angular/core';
import { OrdemService } from '../services/ordem.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AuthService } from '../services/auth.service';
@Component({
  selector: 'app-painel',
  templateUrl: './painel.page.html',
  styleUrls: ['./painel.page.scss'],
})
export class PainelPage implements OnInit {
  ordens:any = [];
  ordensfiltro:any = [];
  base64:string = "";
  constructor(
    private ordemService: OrdemService,
    private authService: AuthService,
    private router: Router) { 
    this.router.events.subscribe((event: Event) => { // Função para obter os eventos da página
        if (event instanceof NavigationEnd) { // Evento FINAL da página
          this.obterOrdens(); //Obter ordens do banco de dados
        }
    });
  }

  ngOnInit() {
  }

  filtrarOrdens(tipo: any) {
    console.log(tipo.target.value);
    this.ordensfiltro = this.ordens.filter((ordem)=>{
      if(ordem.status == tipo.target.value || tipo.target.value == "todos"){
        return ordem;
      }
    })
  }
  EditarOrdem(ordem_id){
    console.log(ordem_id)
    this.router.navigate(['/ordem', ordem_id]);
  }
  obterOrdens(){ //Obter ordens do banco de dados
    this.ordens = [];
    this.ordensfiltro = [];
    console.log("Obtendo ordem")
    this.ordemService.obterOrdens().then((data)=>{ //Obtendo as ordens do banco de dados
      
      data.forEach((doc)=>{ //Loop das ordens ( um a um )
        var ordem = doc.data(); // Obtendo os dados da ordem
        ordem.id = doc.id; // ID da ordem
        var ordem_existente = [];
         ordem_existente = this.ordens.filter((ord,index)=>{ //Filtrando as ordens ATUAIS da página
            if(ord.id == doc.id){ // Caso encontre a ordem atualiaze a mensagem e informe que foi obtida
              this.ordens[index] = ordem;
              return ord;
            }
        })
        if(ordem_existente.length <= 0 ){ // Caso não encontre a ordem insira a ordem em um array para exibir na página
          this.ordens.push(ordem); //Função para inserir array na página
          this.ordensfiltro.push(ordem);
        }
      })
    })
  }

  sair(){
    var sair = this.authService.logout();
    this.router.navigate(['/home']);
  }
}
