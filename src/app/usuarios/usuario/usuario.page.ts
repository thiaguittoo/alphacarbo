import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AlertController, LoadingController } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-usuario',
  templateUrl: './usuario.page.html',
  styleUrls: ['./usuario.page.scss'],
})
export class UsuarioPage implements OnInit {
  titulo:string = "CRIAR USUÁRIO";
  usuario_id:string = null;
  usuario:any = [];
  usuario_in:FormGroup;

  get email() {
    return this.usuario_in.get('email');
  }
  get senha() {
    return this.usuario_in.get('senha');
  }
  constructor(
    private authService:AuthService,
    private fb: FormBuilder,
    private route: ActivatedRoute,private router:Router) { 
     

  }

  ngOnInit() {
    if(this.usuario_id != null){
    this.usuario_in = this.fb.group({
      email: [this.usuario.email, [Validators.required]],
      senha: [this.usuario.senha, [Validators.required]],
    });
    }else{
      this.usuario_in = this.fb.group({
        email: ['', [Validators.required]],
        senha: ['', [Validators.required]],
      });
    }
    
  }

  salvar() {
    var ordem_nova = {
      email: this.usuario_in.get("email").status != "INVALID" ? this.usuario_in.get("email").value : this.usuario.email,
      senha:this.usuario_in.get("senha").status != "INVALID" ? this.usuario_in.get("senha").value : this.usuario.senha,
    }
    this.usuario = ordem_nova;

 
      var criar_usuario = this.authService.criar(this.usuario.email,this.usuario.senha).then((response)=>{
        if(response == true){
          console.log("criar_usuario",criar_usuario)
        this.router.navigate(['/usuarios']);
        }
      })
      
   


  }

  deletarUsuario(){

  }

}
