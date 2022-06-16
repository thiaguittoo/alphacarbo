import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { OrdemService } from '../services/ordem.service';
import { Router } from '@angular/router';
@Component({
  selector: 'app-ordem',
  templateUrl: './ordem.page.html',
  styleUrls: ['./ordem.page.scss'],
})
export class OrdemPage implements OnInit {
  titulo:string = "CRIAR ORDEM";
  ordem_id:string = null;
  ordem_codigo:string = null;
  ordem:any = [];
  ordem_in:FormGroup;
  produtos:any = [];
  embalagens:any = [];
  transportadoras:any = [];

  // Easy access for form fields
  get cliente() {
    return this.ordem_in.get('cliente');
  }
  get produto() {
    return this.ordem_in.get('produto');
  }
  get quantidade() {
    return this.ordem_in.get('quantidade');
  }
  get embalagem() {
    return this.ordem_in.get('embalagem');
  }
  get transportadora() {
    return this.ordem_in.get('transportadora');
  }
  get status() {
    return this.ordem_in.get('status');
  }
  get observacao() {
    return this.ordem_in.get('observacao');
  }
 

  constructor(
    private fb: FormBuilder,
    private loadingController: LoadingController,
    private alertController: AlertController,
    private ordemService: OrdemService,
    private route: ActivatedRoute,private router:Router) { 
    this.route.params.subscribe(params => {
      console.log(params)
      if(params.ordem_id != undefined){
        this.ordem_id = params.ordem_id;
        this.ordemService.ordemPorId(this.ordem_id).then((data)=>{
            console.log(data)
            this.ordem = data;
            this.ordem_codigo = data.codigo;

            this.ordem_in = this.fb.group({
              cliente: [this.ordem.cliente, [Validators.required]],
              produto: [this.ordem.produto, [Validators.required]],
              quantidade: [this.ordem.quantidade, [Validators.required]],
              embalagem: [this.ordem.embalagem, [Validators.required]],
              transportadora: [this.ordem.transportadora, [Validators.required]],
              status: [this.ordem.status, [Validators.required]],
              observacao: [this.ordem.observacao, []],
            });


        })
        this.titulo = "EDITAR ORDEM"
      }
      return params;
    });


  


    this.ordemService.obterProdutos().then((data)=>{
     
      data.forEach((doc)=>{
        var produto = doc.data();
        produto.id = doc.id;
        this.produtos.push(produto);
      })
    })

    

    this.ordemService.obterEmbalagens().then((data)=>{
      data.forEach((doc)=>{
        var embalagem = doc.data();
        embalagem.id = doc.id;
        this.embalagens = embalagem.tamanhos;
      })
    })

    this.ordemService.obterTransporadoras().then((data)=>{

      data.forEach((doc)=>{
        var transportadora = doc.data();
        transportadora.id = doc.id;
        this.transportadoras.push(transportadora);
      })
    })







  }

  ngOnInit() {
    console.log(this.ordem)
    if(this.ordem.cliente != undefined){
    this.ordem_in = this.fb.group({
      cliente: [this.ordem.cliente, [Validators.required]],
      produto: [this.ordem.produto, [Validators.required]],
      quantidade: [this.ordem.quantidade, [Validators.required]],
      embalagem: [this.ordem.embalagem, [Validators.required]],
      transportadora: [this.ordem.transportadora, [Validators.required]],
      status: [this.ordem.status, [Validators.required]],
      observacao: [this.ordem.observacao, []],
    });
    }else{
      this.ordem_in = this.fb.group({
        cliente: ['', [Validators.required]],
        produto: ['', [Validators.required]],
        quantidade: ['', [Validators.required]],
        embalagem: ['', [Validators.required]],
        transportadora: ['', [Validators.required]],
        status: ['', [Validators.required]],
        observacao: ['', []],
      });
    }
    

  }

  async salvar() {
    var ordem_nova = {
      cliente: this.ordem_in.get("cliente").status != "INVALID" ? this.ordem_in.get("cliente").value : this.ordem.cliente,
      produto:this.ordem_in.get("produto").status != "INVALID" ? this.ordem_in.get("produto").value : this.ordem.produto,
      quantidade:this.ordem_in.get("quantidade").status != "INVALID" ? this.ordem_in.get("quantidade").value : this.ordem.quantidade,
      embalagem:this.ordem_in.get("embalagem").status != "INVALID" ? this.ordem_in.get("embalagem").value : this.ordem.embalagem,
      transportadora:this.ordem_in.get("transportadora").status != "INVALID" ? this.ordem_in.get("transportadora").value : this.ordem.transportadora,
      status:this.ordem_in.get("status").status != "INVALID" ? this.ordem_in.get("status").value : this.ordem.status,
      observacao:this.ordem_in.get("observacao").status != "INVALID" ? this.ordem_in.get("observacao").value : this.ordem.observacao
    }
    this.ordem = ordem_nova;

    if(this.ordem_id != null){
      this.ordem.codigo = this.ordem_codigo;
      var atualizar_ordem = await this.ordemService.atualizarOrdem(this.ordem_id,this.ordem).then((response:any)=>{
        if(response == true){
          
        this.router.navigate(['/painel']);
        }
      })
    
    }else{
      var criarordem = this.ordemService.criarOrdem(this.ordem).then((response:any)=>{
        if(response == true){
          
        this.router.navigate(['/painel']);
        }
      })
    }
    
    console.log(this.ordem);
  }
  async warn() {
    return new Promise(async (resolve) => {
      const confirm = await this.alertController.create({
        header: '',
        message: 'Você tem certeza disso?',
        buttons: [
          {
            text: 'Voltar',
            role: 'cancel',
            handler: () => {
              return resolve(false);
            },
          },
          {
            text: 'Deletar',
            handler: () => {
              return resolve(true);
            },
          },
        ],
      });

      await confirm.present();
    });
  }



  async deletarOrdem(){
    const confirmation = await this.warn();
    if (confirmation) {
      var deletarordem = this.ordemService.deletar(this.ordem_id);
      if(deletarordem){
        this.router.navigate(['/painel']);
      }
    }else{
      return false;
    }
  }

}
