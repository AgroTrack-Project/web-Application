import { Component, inject} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';
import {MatButtonToggle, MatButtonToggleGroup} from '@angular/material/button-toggle';

@Component({
  selector: 'app-language-switcher',
  imports: [
    MatButtonToggleGroup,
    MatButtonToggle
  ],
  templateUrl: './language-switcher.html',
  styleUrl: './language-switcher.css',
})
export class LanguageSwitcher {

  protected currentLanguage: string = 'en';

  protected languages = [ 'en', 'es'];

  private translate: TranslateService;

  constructor() {
    this.translate = inject(TranslateService);
    this.currentLanguage = this.translate.getCurrentLang() ?? 'en';
    this.translate.use(this.currentLanguage);
  }

  useLanguage(language: string){
    this.translate.use(language);
    this.currentLanguage = language;
  }
}
