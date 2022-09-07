import { BooleanInput } from '@angular/cdk/coercion';
import { Component, OnInit } from '@angular/core';
import { RoutesMapping } from 'src/app/app-routing.module';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {

  brandLink!: string;

  appMenuList!: MenuItem[];
  currentLink!: string;

  constructor() { 
    this.brandLink = RoutesMapping.home;
    this.currentLink = RoutesMapping.home;
    this.appMenuList = [
      {route:RoutesMapping.home, title: "Home"},
      {route:RoutesMapping.customers, title: "Customers"},
      {route:RoutesMapping.items, title: "Items"},
      {route:RoutesMapping.orders, title: "Orders",
        children: [
          {route:RoutesMapping.ordersList, title: "List"},
          {route:RoutesMapping.ordersCreate, title: "Details"}
        ]  
      }
    ];
  }

  ngOnInit(): void {

  }

}


export interface MenuItem {
  route: string;
  title: string;
  active?: boolean;
  children?: MenuItem[];
}
