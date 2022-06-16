import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { Router, Event, NavigationEnd } from '@angular/router';
import { AlertController, LoadingController } from '@ionic/angular';
@Component({
  selector: 'app-usuarios',
  templateUrl: './usuarios.page.html',
  styleUrls: ['./usuarios.page.scss'],
})
export class UsuariosPage implements OnInit {
  usuarios:any = [];
  constructor(private authService:AuthService,
    private router: Router,
    private alertController:AlertController) {
    this.router.events.subscribe((event: Event) => { // Função para obter os eventos da página
        if (event instanceof NavigationEnd) { // Evento FINAL da página
          console.log("Obtidos",this.usuarios);
          this.obterUsuarios(); //Obter ordens do banco de dados
        }
    });
    
   }

   ngOnInit() {
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

  
   obterUsuarios() {
     this.usuarios = [];
    this.authService.obterUsuarios().then((data)=>{
      data.forEach((doc)=>{
        var usuario = doc.data();
        console.log("Obtidos data",usuario);
        usuario.id = doc.id;
        this.usuarios.push(usuario); 

      })
    });
  }

  async deletarUsuario(id,email,senha){
    const confirmation = await this.warn();
    if (confirmation) {
      var deletarusuario = this.authService.deletar(id,email,senha).then((response) =>{
        this.usuarios = this.usuarios.filter((user,index)=>{
          if(user.id != id){
            return user;
          }
        })
        })
    
    }else{
      return false;
    }
  }


}
