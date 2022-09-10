import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';

export const RoutesMapping = {
  "home":"home",
  "customers": "customers",
  "items":"items",
  "orders":"orders",
  "ordersList":"orders/list",
  "ordersCreate":"orders/create"
};

const routes: Routes = [
  {path:"", redirectTo: "home", pathMatch: "full"},
  {path: "home", component: HomeComponent},
  { path: 'customers', loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule) },
  { path: 'items', loadChildren: () => import('./modules/items/items.module').then(m => m.ItemsModule) },
  { path: 'orders', loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule) },
  { path: 'orders/create', loadChildren: () => import('./modules/order-details/order-details.module').then(m => m.OrderDetailsModule) },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
