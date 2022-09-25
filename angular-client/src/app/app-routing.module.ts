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
  { path:"", redirectTo: RoutesMapping.home, pathMatch: "full"},
  { path: RoutesMapping.home, component: HomeComponent},
  { path: RoutesMapping.customers, loadChildren: () => import('./modules/customers/customers.module').then(m => m.CustomersModule) },
  { path: RoutesMapping.items, loadChildren: () => import('./modules/items/items.module').then(m => m.ItemsModule) },
  { path: RoutesMapping.orders, loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule) },
  { path: RoutesMapping.ordersCreate, loadChildren: () => import('./modules/order-details/order-details.module').then(m => m.OrderDetailsModule) },  
  { path: RoutesMapping.ordersList, loadChildren: () => import('./modules/orders/orders.module').then(m => m.OrdersModule) },  
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
