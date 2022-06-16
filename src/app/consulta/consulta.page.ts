import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { OrdemService } from '../services/ordem.service';
import { Router, Event, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-consulta',
  templateUrl: './consulta.page.html',
  styleUrls: ['./consulta.page.scss'],
})

export class ConsultaPage implements OnInit {
  ordem:any = null;
  ordem_consulta:FormGroup;
  transportadora:any = null;
  constructor(
    private router: Router,
    private fb: FormBuilder,
    private ordemService: OrdemService,
    ) {
      this.ordem_consulta = this.fb.group({
        codigo: ['', [Validators.required]],
      });
      this.router.events.subscribe((event: Event) => { // Função para obter os eventos da página
        if (event instanceof NavigationEnd) { // Evento FINAL da página
          this.ordem = null;
        }
    });
  }

  get codigo() {
    return this.ordem_consulta.get('codigo');
  }

  ngOnInit() {
  }

  async consultar(){
      var codigo = this.ordem_consulta.get("codigo").value;
      this.ordem = await this.ordemService.obterOrdem(codigo).then((response:any)=>{
        if(response != false){
        this.ordem = response;
        this.ordemService.obterTransporadoras().then((data)=>{
          data.forEach((doc)=>{
            var transportadora = doc.data();
            transportadora.id = doc.id;
            if(transportadora.id == this.ordem.transportadora){
              this.transportadora =  transportadora;
            }
          })
        })
        return response;
        }else {
          return null;
        }
      })
      if(this.ordem == null){
        this.ordemService.showAlert("","Ordem não encontrada, verifique seu código");
      }
  }

}
