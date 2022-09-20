import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { NotificationService } from 'src/app/common/notification.service';
import { TableBase } from 'src/app/common/table/table-base';
import { Item } from 'src/app/model/items';
import { ItemsService } from './items.service';

@Component({
  selector: 'app-items',
  templateUrl: './items.component.html',
  styleUrls: ['./items.component.css']
})
export class ItemsComponent extends TableBase<Item> {

  codeRegEx = /^([A-Z]|[0-9])+$/;
 
  currency: string = "$";

  constructor(service: ItemsService, notification: NotificationService) { 
    super(service,notification);
    this.tableColumns = ["Code","Description","price","command"];
    this.entityEditorFormGroup = new FormGroup({
      "id": new FormControl(null),
      "code": new FormControl('',[Validators.required, Validators.pattern(this.codeRegEx)]),
      "description": new FormControl('',[Validators.required]),
      "price": new FormControl('',[Validators.required])
    });
  }

  override ngOnInit(): void {
    super.ngOnInit();
  }

  override saveFailMessage(): string {
    return "Item saved successfully"
  }
  override getSaveSuccedMessage(): string {
      return "Fail to save item"
  }

  override getFailToLoadEntityMessage(): string {
    return "fail to load items";
  }

  override getDeleteSucessfullyMessage(): string {
    return "Item successfully deleted";
  }
  override getDeleteFailMessage(): string {
      return "Fail to delete item";
  }
}
