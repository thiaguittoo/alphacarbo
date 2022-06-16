import { Injectable } from '@angular/core';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,deleteUser
} from '@angular/fire/auth';
import { doc, getDoc,deleteDoc, Firestore, setDoc,collection,getDocs,addDoc, query, where   } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { Storage } from '@capacitor/storage';

 
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(
    private alertController:AlertController,
    private auth: Auth,
    private firestore: Firestore) {
      // this.auth.useDeviceLanguage();
      this.auth.languageCode = 'pt';

    }
 
    async criar(email, senha ) {
      try {
        this.auth.languageCode = 'pt';
        const user:any = await createUserWithEmailAndPassword(
          this.auth,
          email,
          senha
        ) .then((userCredential) => {
          // Signed in
          const user = userCredential.user;
          console.log(user)
          return user;
          // ...
        })
        .catch((error) => {
          console.log(error)
          const errorCode = error.code;
          const errorMessage = error.message;
          // ..
        });
        console.log("Usuário  com : ", user);
        if(user){
          var data_criacao = new Date();
          var data_atualizacao = new Date();
          var criar_usuario =  await addDoc(collection(this.firestore, "usuarios"), {
            uid:user.uid,
            email:email,
            senha:senha,
            criacao:data_criacao,
            atualizacao:data_atualizacao,
          });
          if(criar_usuario){
            return true;
          }
        }
      
      } catch (e) {
        return null;
      }
    }

    

    async showAlert(header, message) { // Função de alertas
      const alert = await this.alertController.create({
        header,
        message,
        buttons: ['OK'],
      });
      await alert.present();
    }

 
    async login({ email, password }) {
      try {
        this.auth.languageCode = 'pt';
        const user = await signInWithEmailAndPassword(this.auth, email, password).then((response)=>{
          console.log("Logged",response)
          return response;
        })
        await Storage.set({
          key: 'user',
          value: JSON.stringify({email:email,pass:password}),
        });
        return user;
      } catch (e) {
        console.log("Error",e)
        return null;
      }
    }
 
    async deletar(id,email,password) { // Função para deletar usuario
      var usuario_origin = this.auth.currentUser;

      const { value } = await Storage.get({ key: 'user' });
      var useu_origin = JSON.parse(value);

      var email_origin = useu_origin.email;
      var pass_origin = useu_origin.pass;
    
      console.log(email,password);
      console.log(email_origin,pass_origin);
      const user = await signInWithEmailAndPassword(this.auth, email, password).then((response)=>{return response})
      const deletar = await deleteUser(this.auth.currentUser);
      var logar = await signInWithEmailAndPassword(this.auth, email_origin, pass_origin);
    
      var deletar_usuario = await deleteDoc(doc(this.firestore,"usuarios",id)).then(()=>{
       this.showAlert("","Usuário deletado com sucesso");
       return true;
      })
    }
    
    
  async obterUsuarios() {
    const usuariosRef = collection(this.firestore, "usuarios");
    const querySnapshot = await getDocs(usuariosRef);
    return querySnapshot;
  }
  logout() {
    
    return signOut(this.auth);
  }
}