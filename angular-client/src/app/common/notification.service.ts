import { ConnectionPositionPair, FlexibleConnectedPositionStrategy, Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { ChoicesDialogComponent, IChoicesDialogData, IChoice } from './choices-dialog/choices-dialog.component';
import { LoaderComponent } from './loader/loader.component';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  overlayRef!:OverlayRef;

  constructor(private snackBar: MatSnackBar, public dialog: MatDialog, private translate: TranslateService, private overlay:Overlay) {
     
  }


  info(text: string) {
    this.translate.get(text).subscribe( (translatedText)=>{
      this.snackBar.open(translatedText,"X",{panelClass:["bg-success","text-white", "text-wrap"]});
    });    
  }

  warning(text: string) {
    this.translate.get(text).subscribe( (translatedText)=>{
      this.snackBar.open(translatedText,"X",{panelClass:["bg-warning" ,"text-wrap"]});
    });   
  }

  error(text: string) {
    this.translate.get(text).subscribe( (translatedText)=>{
      this.snackBar.open(translatedText,"X",{panelClass:["bg-danger","text-white", "text-wrap"]});
    });  
  }

  longProcessOngoing(state:boolean){
    if(state == true){
      const positionStrategy = this.overlay.position().global().centerHorizontally().centerVertically();
      this.overlayRef = this.overlay.create({
        hasBackdrop: true,
        positionStrategy
      });
      const spinnerProgress = new ComponentPortal(LoaderComponent);
      this.overlayRef.attach(spinnerProgress);
    } else {
      if(this.overlayRef!=null){
        this.overlayRef.detach();
        this.overlayRef.dispose();
      }
    }
  }

  positionedLoader(state:boolean){
    
  }

  public userChoice(data:IChoicesDialogData, dialogSize?:{width?: any, heigth?: any }): Observable<any>{
    let composedData = {...dialogSize,data:data};
    let dialogRef = this.dialog.open(ChoicesDialogComponent,composedData);
    return dialogRef.afterClosed();
  }
}
