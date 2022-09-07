import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Customer, Gender } from 'src/app/model/customer';

@Component({
  selector: 'app-customers',
  templateUrl: './customers.component.html',
  styleUrls: ['./customers.component.css']
})
export class CustomersComponent implements OnInit {

  tableColumns: string[] = ["Code", "Name","Address", "Phones","Email","gender","command"];
  datas: readonly Customer[] = [];

  inEditionMode: boolean = false;
  customerEditorFormGroup = new FormGroup({
    "code": new FormControl('',[Validators.required]),
    "name": new FormControl('',[Validators.required]),
    "address": new FormControl('',[Validators.required]),
    "phone": new FormControl('',[/*Validators.pattern(/[0-9]{3}(-|\s)/),*/Validators.maxLength(12)]),
    "email": new FormControl('',[Validators.email]),
  });

  genderList!: {value:string, name:string}[];

  constructor() { 
    this.genderList = [
      {name:"Female", value: Gender[Gender.FEMALE]},
      {name:"Male", value: Gender[Gender.MALE]}
    ];
  }

  ngOnInit(): void {
  }

  addCustomerToArray(){
    if(this.inEditionMode==false){
      let customer = new Customer();
      customer.editable = true;
      this.initCustomerEditorForm(customer);
      this.datas = [customer].concat(this.datas);
    }
  }

  saveEditedCustomer(row:any){
    let customer = {...row,...this.customerEditorFormGroup.value};
    customer.editable = false;
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ data.editable == true});
    if(index!=-1){      
      datas.splice(index,1,customer);
      this.datas = datas;
    }
  }

  editCustomer(row:Customer){
    if(this.inEditionMode == true){// first we deactivate edition on the current edited row
      let datas = [...this.datas];
      const index = datas.findIndex((data)=>{ data.editable == true});
      if(index!=-1){   
        datas[index].editable = false; 
        this.datas = datas;
      }
    }
    row.editable = true;
    this.initCustomerEditorForm(row);
    this.datas = [...this.datas];
    this.inEditionMode = true;
  }

  deleteCustomer(row: Customer){
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ data.editable == true});
    if(index!=-1){      
      datas.splice(index,1);
      this.datas = datas;
    }
    this.inEditionMode = false;
  }

  initCustomerEditorForm(customer:Customer){
    this.customerEditorFormGroup.reset();
    this.inEditionMode = true;
    this.customerEditorFormGroup.setValue(customer.getEditionData());    
  }
}
