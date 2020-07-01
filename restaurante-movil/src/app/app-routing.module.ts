import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    redirectTo: 'home',
    pathMatch: 'full'
  },
  // { path: 'home', loadChildren: () => import('./home/home.module').then( m => m.HomePageModule)},
  { path: 'home', loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule) },
  { path: 'categories', loadChildren: () => import('./pages/categories/categories.module').then(m => m.CategoriesPageModule) },
  { path: 'login', loadChildren: () => import('./pages/login/login.module').then(m => m.LoginPageModule) },
  { path: 'signup', loadChildren: () => import('./pages/signup/signup.module').then(m => m.SignupPageModule) },
  { path: 'products/:id_categoria/:imagen_categoria/:nombre_categoria', loadChildren: () => import('./pages/products/products.module').then(m => m.ProductsPageModule) },
  { path: 'pedidos', loadChildren: () => import('./pages/pedidos/pedidos.module').then(m => m.PedidosPageModule) },
  { path: 'juegos', loadChildren: () => import('./pages/juegos/juegos.module').then(m => m.JuegosPageModule) },
  { path: 'promociones', loadChildren: () => import('./pages/promociones/promociones.module').then(m => m.PromocionesPageModule) },
  {
    path: 'sugerencias',
    loadChildren: () => import('./pages/sugerencias/sugerencias.module').then( m => m.SugerenciasPageModule)
  },

  // { path: 'cliente', loadChildren: () => import('./pages/cliente/cliente.module').then(m => m.ClientePageModule) },
  // { path: 'product-modal', loadChildren: () => import('./pages/product-modal/product-modal.module').then(m => m.ProductModalPageModule) },

];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, { preloadingStrategy: PreloadAllModules })
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
