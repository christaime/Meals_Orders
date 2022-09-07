import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { CustomersComponent } from './components/customers/customers.component';
import { ItemsComponent } from './components/items/items.component';
import { OrdersComponent } from './components/orders/orders.component';
import { OrdersCreateComponent } from './components/orders-create/orders-create.component';

export const RoutesMapping = {
  "home":"home",
  "customers": "customers",
  "items":"items",
  "orders":"orders",
  "ordersList":"orders/list",
  "ordersCreate":"orders/create"
};

const routes: Routes = [
  {path: "home", component: HomeComponent},
  {path: "customers", component: CustomersComponent},
  {path: "items", component: ItemsComponent},
  {path: "orders", component: OrdersComponent , 
      children:[
            {path: "list", component: OrdersComponent},
            {path: "create", component: OrdersCreateComponent}
      ]
  },
  {path:"", redirectTo: "home", pathMatch: "full"}
];

@NgModule({
  imports: [RouterModule.forRoot(routes, {useHash: true})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
