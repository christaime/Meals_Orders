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
  isNewRowEditionMode: boolean = false;

  codeRegEx = /^([A-Z]|[0-9])+$/;
  nameRegEx = /^([A-Z]|[0-9]|\s|\.|[ŒÉÊÀÇ_È-])+$/;
  //phoneRegEx = /^([0-9]|(([0-9]{3}((-)*[0-9]{3}))+))+$/;
  //phoneRegEx=/(^([0-9]{9,12})$)/;
  phoneRegEx =/^(([0-9]{9,12})|((([\+]?)([0-9]{1,3}))(([\s-]([0-9]{3})){3,4})))$/
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
      /*this.searchControl.valueChanges.subscribe( (val)=>{
        this.search(val);
      });  */  
  }

  search(text?:string){
    this.filter.text = text;
    this.notification.longProcessOngoing(true);
    this.service.search(this.filter).subscribe( {
      next: (page:ResponsePage)=>{
        this.notification.longProcessOngoing(false);
        this.datas = page.content? page.content : [];
        this.totalElements = page.totalElements;
      },
      error: (er)=>{
        this.notification.longProcessOngoing(false);
        this.notification.error("Fail to load customers");
      }
  });
  }

  addCustomerToArray(){
    console.log("addCustomerToArray");
    if(this.inEditionMode==false){
      let customer = new Customer();
      customer.editable = true;
      this.isNewRowEditionMode = true;
      this.initCustomerEditorForm(customer);
      this.datas = [customer].concat(this.datas);
    }
  }

  saveEditedCustomer(row:any){
    console.log("saveEditedCustomer",row);
    let customer = {...row,...this.customerEditorFormGroup.value};
    customer.editable = false;
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.editable == true && data.id === row.id});
    if(index!=-1){  
      //save the customer on server
      let newLine = customer.id? false: true;
      this.notification.longProcessOngoing(true);
      this.service.save(customer).subscribe({
        next: (value: Customer)=>{
          this.notification.longProcessOngoing(false);
          value.editable = false;
          console.log("save value in component ", value);
          datas.splice(index,1,value);
          let total = newLine === true? this.totalElements + 1 : this.totalElements;
          this.totalElements = total;
          console.log({newLine,totalElements: this.totalElements});
          this.datas = datas;
          this.inEditionMode = false;
          this.isNewRowEditionMode = false;
          this.notification.info("Customer sucessfully saved");
        },
        error: (error)=>{
          this.notification.longProcessOngoing(false);
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
    let canEdit = true;
    if(this.inEditionMode == true && !this.customerEditorFormGroup.valid){
      // ask to complete edition
      this.notification.userChoice({choices: [{text:"Ok", value: 1}],
        questionText:" Complete the current line edition! ",
        dialogTitle: "Data edition safety"}).subscribe( (response)=>{
          console.log(" User choose ", response);
        });
    } else {
      if(this.inEditionMode == true ){
        // first we deactivate edition on the current edited row
          let datas = [...this.datas];
          const index = datas.findIndex((data)=>{ return data.editable == true});
          if(index!=-1){  
            console.log("Previous edition",datas[index].id == null,datas[index]); 
            if(datas[index].id == null || datas[index].id == undefined){
              this.notification.userChoice({choices: [{text:"Save data", value: 1},{text:"Loose data", value: 2}],
                questionText:" You are about to loose the data edited! ",
                dialogTitle: "Data edition safety"}).subscribe( (response)=>{
                  console.log(" User choose ", response);
                  if(response.value===2){
                    datas.splice(index,1);
                    this.datas = datas;
                  }else{
                    this.saveEditedCustomer(datas[index]);
                    this.editCustomer(row);
                  }
              });              
            }else {
              datas[index].editable = false; 
              this.datas = datas;
              this.editCustomer(row);
            }
            
          }else{
            this.putRowInEditionState(row);
          }
      }else{
        this.putRowInEditionState(row);
      }
    }
  }

  putRowInEditionState(row:Customer){
    console.log("putRowInEditionState",row);
        row.editable = true;
        this.initCustomerEditorForm(row);
        this.datas = [...this.datas];
        this.inEditionMode = true;
  }

  deleteCustomer(row: Customer){
    console.log("deleteCustomer",row);
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.id === row.id});
    console.log({datas, index});
    if(index!=-1){   
      this.notification.userChoice({choices: [
        {text: "NO",value: false},{text: "YES",value: true}
      ],
      questionText: "Do you realy want to delete?",
      dialogTitle: "Delete confirmation"}).subscribe( (res:boolean)=>{
          if(res === true){
            this.notification.longProcessOngoing(true);
              this.service.delete(row.id+'').subscribe( {
                next: (res)=>{
                  this.notification.longProcessOngoing(false);
                  datas.splice(index,1);
                  this.datas = datas;
                  this.notification.info("Customer sucessfully deleted");
                },
                error: (err)=>{
                  this.notification.longProcessOngoing(false);
                  console.error(err);
                  this.notification.error(err);
                }
              });
          }
      });
    }
    this.inEditionMode = false;
  }

  initCustomerEditorForm(customer:Customer){
    this.customerEditorFormGroup.reset();
    this.inEditionMode = true;
    console.log("initCustomerEditorForm",customer);
    this.customerEditorFormGroup.patchValue(customer as any);    
  }

  cancelEdition(row:Customer){
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.editable == true});
    if(index !== -1){
      datas[index].editable = false;
    }
    this.datas = datas;
    this.inEditionMode = false;
    this.isNewRowEditionMode = false;
  }

  pageChanged(event:any) {
    console.log({event});
    this.filter.pageSize = event.pageSize;
    this.filter.page = event.pageIndex;
    this.search(this.searchControl.value);
  }


  sortData(event:any){
    console.log("sortDate ",{event});
    if(event && event.direction !== ""){
      this.filter.sort = event;
      this.search(this.searchControl.value);
    }else {
      this.filter.sort = undefined;
    }
  }
}
