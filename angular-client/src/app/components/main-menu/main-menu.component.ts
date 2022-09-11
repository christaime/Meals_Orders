
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
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
    console.log( window.location.href );
    
    this.brandLink = RoutesMapping.home;
    let index = window.location.href.indexOf('#');
    this.currentLink =  index != -1 ? window.location.href.substring(index+2).split('/')[0] : RoutesMapping.home;
    console.log({index},this.currentLink);
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
