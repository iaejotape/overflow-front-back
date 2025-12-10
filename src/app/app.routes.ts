import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: 'entrar',
    loadComponent: () => import('./login/login.page').then((m) => m.LoginPage),
  },
  {
    path: 'cadastrar',
    loadComponent: () => import('./signup/signup.page').then((m) => m.SignupPage),
  },
  {
    path: '',
    redirectTo: 'entrar',
    pathMatch: 'full',
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.page').then( m => m.DashboardPage)
  },
  {
    path: 'questoes',
    loadComponent: () => import('./pages/questoes/questoes.page').then( m => m.QuestoesPage)
  },
  {
    path: 'adicionar-questao',
    loadComponent: () => import('./pages/adicionar-questao/adicionar-questao.page').then( m => m.AdicionarQuestaoPage)
  },
  {
  path: 'editar-questao/:id',
    loadComponent: () =>
      import('./pages/adicionar-questao/adicionar-questao.page').then(
        (m) => m.AdicionarQuestaoPage
      ),
  },
  {
    path: 'perfil',
    loadComponent: () => import('./pages/perfil/perfil.page').then(m => m.PerfilPage)
  },

];
