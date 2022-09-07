import { Component, OnInit } from '@angular/core';
import { Customer} from '../../model/customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  tableColumns: string[] = ["Code", "Name","Address", "Phones","Email","gender","command"];
  datas: readonly Customer[] = [];

  constructor() { }

  ngOnInit(): void {
  }

  addCustomerToArray(){
  }
}
