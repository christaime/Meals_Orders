import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, UntypedFormControl, Validators } from '@angular/forms';
import { data } from 'jquery';
import { Filter, ResponsePage } from 'src/app/common/http-service.service';
import { NotificationService } from 'src/app/common/notification.service';
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

  pageSizeOptions = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[1];
  totalElements = 0;

  filter!: Filter;

  inEditionMode: boolean = false;

  codeRegEx = /^([A-Z]|[0-9])+$/;
  nameRegEx = /^([A-Z]|[0-9]|\s|[ŒÉÊÀÇ_È-])+$/;
  //phoneRegEx = /^([0-9]|(([0-9]{3}((-)*[0-9]{3}))+))+$/;
  phoneRegEx=/(^([0-9]{9,13})$)/;
  //phoneRegEx =/^((([\+]?)([0-9]{1-3}))(([\s-]([0-9]{3})){3,4}))$/
  customerEditorFormGroup = new FormGroup({
    "id": new FormControl(null),
    "code": new FormControl('',[Validators.required, Validators.pattern(this.codeRegEx)]),
    "name": new FormControl('',[Validators.required,Validators.pattern(this.nameRegEx)]),
    "address": new FormControl('',[Validators.required,Validators.pattern(this.nameRegEx)]),
    "phone": new FormControl('',[Validators.pattern(this.phoneRegEx)]),
    "email": new FormControl('',[Validators.email]),
    "gender": new FormControl('',[]),
  });

  genderList!: {value:string, name:string}[];

  searchControl: FormControl  = new FormControl('');

  constructor(private service: CustomersService, private notification: NotificationService) { 
    this.genderList = [
      {name:"Female", value: Gender[Gender.FEMALE]},
      {name:"Male", value: Gender[Gender.MALE]}
    ];
    this.filter = new Filter();
  }

  ngOnInit(): void {
      this.search();
      this.searchControl.valueChanges.subscribe( (val)=>{
        this.search(val);
      });    
  }

  search(text?:string){
    this.filter.text = text;
    this.service.search(this.filter).subscribe( {
      next: (page:ResponsePage)=>{
        this.datas = page.content? page.content : [];
        this.totalElements = page.totalElements;
      },
      error: (er)=>{
        this.notification.error("Fail to load customers");
      }
  });
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
          this.notification.info("Customer sucessfully saved");
        },
        error: (error)=>{
          console.error(error);
          this.notification.error("Customer save failed");
        }
      }) ;    
    }
  }

  editCustomer(row:Customer){
    console.log("editCustomer",row);
    if(row.id != null){
      this.customerEditorFormGroup.markAsTouched();
      this.customerEditorFormGroup.updateValueAndValidity();
    }
    if(this.inEditionMode == true && !this.customerEditorFormGroup.valid){
      // ask to complete edition
    } else {
      if(this.inEditionMode == true ){
        // first we deactivate edition on the current edited row
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
            this.notification.info("Customer sucessfully deleted");
          },
          error: (err)=>{
            console.error(err);
            this.notification.error("Customer deletion failed");
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

  pageChanged(event:any) {
    console.log({event});
  }
}
