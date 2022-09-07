import { Component } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {

  constructor(private title: Title, private translateService: TranslateService){
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
}
