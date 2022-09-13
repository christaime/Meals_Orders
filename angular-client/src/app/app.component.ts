import { Overlay } from '@angular/cdk/overlay';
import { ComponentPortal } from '@angular/cdk/portal';
import { Component } from '@angular/core';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';
import { NotificationService } from './common/notification.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  protected toogle: boolean = false;

  constructor(private title: Title, private translateService: TranslateService,
      private overlay: Overlay,
      private notif: NotificationService,
      private snackBar:MatSnackBar){
      const titleText: string = "The Delights of Marly";
      const defaultLang: string = "en";
      this.title.setTitle(titleText);
      this.translateService.use(defaultLang);
      this.translateService.setDefaultLang(defaultLang);
      this.translateService.onLangChange.subscribe( (lang)=>{
            this.translateService.get(titleText).subscribe( (res)=>{
                this.title.setTitle(res);
            });
      });

  }

  public openSnackBar(){
    //this.snackBar.open("hello!","X",{panelClass:["bg-success","text-white", "text-wrap"]});
    /*const overlayRef = this.overlay.create({
      height: '400px',
      width: '600px',
    });
    const userProfilePortal = new ComponentPortal(MatProgressSpinner);
    overlayRef.attach(userProfilePortal);*/
    this.toogle=!this.toogle;
    this.notif.longProcessOngoing(this.toogle);
  }
}
