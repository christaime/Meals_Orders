import { Component, OnInit } from "@angular/core";
import { FormControl, FormGroup } from "@angular/forms";
import { Persistable } from "src/app/model/persistable";
import { Filter, HttpServiceService, ResponsePage } from "../http-service.service";
import { NotificationService } from "../notification.service";

@Component({
    template: ""
})
export class TableBase<T extends Persistable> implements OnInit{
  
  tableColumns: string[] = [];
  datas: readonly T[] = [];

  pageSizeOptions = [5, 10, 25, 100];
  pageSize = this.pageSizeOptions[1];
  totalElements = 0;

  filter!: Filter;

  inEditionMode: boolean = false;

  entityEditorFormGroup!: FormGroup;

  genderList!: {value:string, name:string}[];

  searchControl: FormControl  = new FormControl('');

  constructor(private service: HttpServiceService<T>, private notification: NotificationService) { 
    this.filter = new Filter();
  }

  ngOnInit(): void {
      this.search();
  }

  search(text?:string){
    this.filter.text = text;
    this.notification.longProcessOngoing(true);
    this.service.search(this.filter).subscribe( {
      next: (page:ResponsePage)=>{
        this.datas = page.content? page.content : [];
        this.totalElements = page.totalElements;
        this.notification.longProcessOngoing(false);
      },
      error: (er)=>{
        this.notification.longProcessOngoing(false);
        this.notification.error(this.getFailToLoadEntityMessage());
      }
  });
  }
   
  addEntityToArray(){
    console.log("addEntityToArray");
    if(this.inEditionMode==false){
      let entity = {} as T;
      entity.editable = true;
      this.initEntityEditorForm(entity);
      this.datas = [entity].concat(this.datas);
    }
  }

  saveEditedEntity(row:any){
    console.log("saveEditedEntity",row);
    let entity = {...row,...this.entityEditorFormGroup.value};
    entity.editable = false;
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.editable == true && data.id === row.id});
    if(index!=-1){  
      //save the entity on server
      let newLine = entity.id? false: true;
      this.notification.longProcessOngoing(true);
      this.service.save(entity).subscribe({
        next: (value: T)=>{
          this.notification.longProcessOngoing(false);
          value.editable = false;
          console.log("save value in component ", value);
          datas.splice(index,1,value);
          let total = newLine === true? this.totalElements + 1 : this.totalElements;
          this.totalElements = total;
          console.log({newLine,total,totalElements: this.totalElements});
          this.datas = datas;
          this.inEditionMode = false;
          this.notification.info(this.getSaveSuccedMessage());
        },
        error: (error)=>{
          this.notification.longProcessOngoing(false);
          console.error(error);
          this.notification.error(this.saveFailMessage());
        }
      }) ;    
    }
  }

  /**
   * To be redefined
   * @returns 
   */
    saveFailMessage(): string {
        return "Entity saved successfully"
    }
    getSaveSuccedMessage(): string {
        return "fail to save entity"
    }

    getFailToLoadEntityMessage(): string {
        return "fail to load entity";
    }

    getDeleteSucessfullyMessage(): string {
        return "Entity successfully deleted";
    }
    getDeleteFailMessage(): string {
        return "Fail to delete entity";
    }

  editEntity(row:T){
    console.log("editEntity",row);
    if(row.id != null){
      this.entityEditorFormGroup.markAsTouched();
      this.entityEditorFormGroup.updateValueAndValidity();
    }
    let canEdit = true;
    if(this.inEditionMode == true && !this.entityEditorFormGroup.valid){
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
                    this.saveEditedEntity(datas[index]);
                    this.editEntity(row);
                  }
              });              
            }else {
              datas[index].editable = false; 
              this.datas = datas;
              this.editEntity(row);
            }
            
          }else{
            this.putRowInEditionState(row);
          }
      }else{
        this.putRowInEditionState(row);
      }
    }
  }

  putRowInEditionState(row:T){
    console.log("putRowInEditionState",row);
        row.editable = true;
        this.initEntityEditorForm(row);
        this.datas = [...this.datas];
        this.inEditionMode = true;
  }

  deleteEntity(row: T){
    console.log("deleteEntity",row);
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.id === row.id });
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
                this.notification.info(this.getDeleteSucessfullyMessage());
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
}

  initEntityEditorForm(entity:T){
    this.entityEditorFormGroup.reset();
    this.inEditionMode = true;
    console.log("initEntityEditorForm",entity);
    this.entityEditorFormGroup.patchValue(entity as any);    
  }


  cancelEdition(row:any){
    let datas = [...this.datas];
    const index = datas.findIndex((data)=>{ return data.editable == true});
    if(index !== -1){
      datas[index].editable = false;
    }
    this.datas = datas;
    this.inEditionMode = false;
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