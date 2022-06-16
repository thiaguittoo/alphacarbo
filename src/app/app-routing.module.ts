import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import {
  redirectUnauthorizedTo,
  redirectLoggedInTo,
  canActivate,
} from '@angular/fire/auth-guard';

const redirectUnauthorizedToLogin = () => redirectUnauthorizedTo(['']);
const redirectLoggedInToHome = () => redirectLoggedInTo(['painel']);
const routes: Routes = [
  {
    path: 'home',
    loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)
  },
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  {
    path: 'entrar',
    loadChildren: () => import('./login/login.module').then( m => m.LoginPageModule),
    ...canActivate(redirectLoggedInToHome),
  },
  {
    path: 'consulta',
    loadChildren: () => import('./consulta/consulta.module').then( m => m.ConsultaPageModule)
  },
  {
    path: 'painel',
    loadChildren: () => import('./painel/painel.module').then( m => m.PainelPageModule),
    ...canActivate(redirectUnauthorizedToLogin),
  },
  {
    path: 'ordem/:ordem_id',
    loadChildren: () => import('./ordem/ordem.module').then( m => m.OrdemPageModule)
  },
  {
    path: 'ordem',
    loadChildren: () => import('./ordem/ordem.module').then( m => m.OrdemPageModule)
  },
  {
    path: 'usuarios',
    loadChildren: () => import('./usuarios/usuarios/usuarios.module').then( m => m.UsuariosPageModule)
  },
  {
    path: 'usuario',
    loadChildren: () => import('./usuarios/usuario/usuario.module').then( m => m.UsuarioPageModule)
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
