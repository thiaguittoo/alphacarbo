import { Injectable } from '@angular/core';
import { Auth } from '@angular/fire/auth';
import { doc, getDoc,deleteDoc, Firestore, setDoc,collection,getDocs,addDoc, query, where   } from '@angular/fire/firestore';
import { AlertController, LoadingController } from '@ionic/angular';
import { randomBytes } from 'crypto';

@Injectable({
  providedIn: 'root'
})
export class OrdemService {

  constructor(
    private auth: Auth,
    private firestore: Firestore,
    private loadingController: LoadingController,
    private alertController: AlertController,) { }

    
    async obterOrdens() {
      const ordensRef = collection(this.firestore, "ordens");
      const querySnapshot = await getDocs(ordensRef);
      return querySnapshot;
    }
    
    async obterProdutos() {
      const produtosRef = collection(this.firestore, "produtos");
      const querySnapshot = await getDocs(produtosRef);
      return querySnapshot;
    }
    
    async obterEmbalagens() {
      const embalagensRef = collection(this.firestore, "embalagens");
      const querySnapshot = await getDocs(embalagensRef);
      return querySnapshot;
    }

    async obterTransporadoras() {
      const transportadorasRef = collection(this.firestore, "transportadoras");
      const querySnapshot = await getDocs(transportadorasRef);
      return querySnapshot;
    }

    async showAlert(header, message) { // Função de alertas
      const alert = await this.alertController.create({
        header,
        message,
        buttons: ['OK'],
      });
      await alert.present();
    }

    async atualizarOrdem(id,dados) { // Função para atualizar ordem
        const ordemRef = doc(this.firestore, `ordens/${id}`);
        var data_atualizacao = new Date();
        dados.atualizado_em = data_atualizacao;
        return await setDoc(ordemRef, dados).then(()=>{
           this.showAlert("","Ordem atualizada com sucesso")
           return true;
        })
     
    }
     randLetter(length) {
      var result           = '';
      var characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
      var charactersLength = characters.length;
      for ( var i = 0; i < length; i++ ) {
        result += characters.charAt(Math.floor(Math.random() * 
   charactersLength));
     }
     return result;
   }
     rand(min, max) {
      min = Math.ceil(min);
      max = Math.floor(max);
      return Math.floor(Math.random() * (max - min)) + min;
    }
    async criarOrdem(dados) { // Função para criar ordem
      var data_criacao = new Date();
      var data_atualizacao = new Date();
      dados.criado_em = data_criacao;
      dados.atualizado_em = data_atualizacao;
      dados.codigo = this.randLetter(1)+this.rand(0,9)+this.randLetter(1)+this.rand(0,9)+this.randLetter(1)+this.rand(0,9);
       return await addDoc(collection(this.firestore, "ordens"), dados).then((ordem)=>{
          console.log("Ordem criada: ", ordem.id);
          this.showAlert("","Ordem criada com sucesso")
          return true;
        })
        
      
    }

    async ordemPorId(id){

      const docRef = doc(this.firestore, "ordens", id);
      const docSnap = await getDoc(docRef);


      if (docSnap.exists()) {
        var ordem = docSnap.data();
        ordem.id = docSnap.id;
        return ordem;
      } else {
        // doc.data() will be undefined in this case
        console.log("No such document!");
      }

    }
    
    async deletar(id) { // Função para atualizar ordem
      var deletar_ordem = await deleteDoc(doc(this.firestore,"ordens",id)).then(()=>{
        return true;
      })
      if(deletar_ordem){
      this.showAlert("","Ordem deletada com sucesso")
      return true;
      }
    }
  
    async obterOrdem(codigo) {
      const ordensRef = collection(this.firestore, "ordens");
      const q = query(ordensRef, where("codigo", "==", codigo));
      const querySnapshot = await getDocs(q);
      var ordem_obtida = null;

      await querySnapshot.forEach((doc) => {
        console.log(doc.id, " => ", doc.data());
        ordem_obtida = doc.data();
        return doc.data();
      });

      return ordem_obtida;
      
    }

    

}
