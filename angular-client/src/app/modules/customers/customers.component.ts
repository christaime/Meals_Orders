import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Customer, Gender } from 'src/app/model/customer';
import { CustomersService } from './customers.service';

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
    "id": new FormControl(null),
    "code": new FormControl('',[Validators.required]),
    "name": new FormControl('',[Validators.required]),
    "address": new FormControl('',[Validators.required]),
    "phone": new FormControl('',[/*Validators.pattern(/[0-9]{3}(-|\s)/,*/Validators.maxLength(12)]),
    "email": new FormControl('',[Validators.email]),
    "gender": new FormControl('',[]),
  });

  genderList!: {value:string, name:string}[];

  constructor(private service: CustomersService) { 
    this.genderList = [
      {name:"Female", value: Gender[Gender.FEMALE]},
      {name:"Male", value: Gender[Gender.MALE]}
    ];
  }

  ngOnInit(): void {
  }

  addCustomerToArray(){
    console.log("addCustomerToArray");
    if(this.inEditionMode==false){
      let customer = new Customer();
      customer.editable = true;
      this.initCustomerEditorForm(customer);
      this.datas = [customer].concat(this.datas);
    }
  }

  saveEditedCustomer(row:any){
    console.log("saveEditedCustomer",row);
    let customer = {...row,...this.customerEditorFormGroup.value};
    customer.editable = false;
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.editable == true});
    if(index!=-1){  
      //save the customer on server
      this.service.save(customer).subscribe({
        next: (value: Customer)=>{
          value.editable = false;
          datas.splice(index,1,value);
          this.datas = datas;
          this.inEditionMode = false;
        },
        error: (error)=>{
          console.error(error);
        }
      }) ;    
    }
  }

  editCustomer(row:Customer){
    console.log("editCustomer",row);
    if(this.inEditionMode == true){// first we deactivate edition on the current edited row
      let datas = [...this.datas];
      const index = datas.findIndex((data)=>{ return data.editable == true});
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
    console.log("deleteCustomer",row);
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.editable == true});
    console.log({datas, index});
    if(index!=-1){   
      if(row.id == null){
        datas.splice(index,1);
        this.datas = datas;
      }else {
        this.service.delete(row.id).subscribe( {
          next: (res)=>{
            datas.splice(index,1);
            this.datas = datas;
          },
          error: (err)=>{
            console.error(err);
          }
        });
      }
      
    }
    this.inEditionMode = false;
  }

  initCustomerEditorForm(customer:Customer){
    this.customerEditorFormGroup.reset();
    this.inEditionMode = true;
    console.log("initCustomerEditorForm",customer);
    this.customerEditorFormGroup.patchValue(customer as any);    
  }
}
