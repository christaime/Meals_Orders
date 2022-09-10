import { Overlay, OverlayRef } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Injectable } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { TranslateService } from '@ngx-translate/core';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  overlayRef!:OverlayRef;

  constructor(private snackBar: MatSnackBar, private translate: TranslateService, private overlay:Overlay) {
     
  }


  info(text: string) {
    this.translate.get(text).subscribe( (translatedText)=>{
      this.snackBar.open(translatedText,"X",{panelClass:"bg-success text-white text-wrap"});
    });    
  }

  warning(text: string) {
    this.translate.get(text).subscribe( (translatedText)=>{
      this.snackBar.open(translatedText,"X",{panelClass:"bg-warning text-wrap"});
    });   
  }

  error(text: string) {
    this.translate.get(text).subscribe( (translatedText)=>{
      this.snackBar.open(translatedText,"X",{panelClass:"bg-danger text-white text-wrap"});
    });  
  }

  longProcessOngoing(state:boolean){
    if(state == true){
      this.overlayRef = this.overlay.create();
      const spinnerProgress = new ComponentPortal(MatProgressSpinner);
      this.overlayRef.attach(spinnerProgress);
    } else {
      this.overlayRef.detach();
      this.overlayRef.dispose();
    }
  }
}
