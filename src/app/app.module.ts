import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {IdpService} from '../services/idp.service';
import {HttpClientModule} from '@angular/common/http';
import {SliderModule} from 'primeng/slider';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import { HeaderComponent } from './header/header.component';
import {ListboxModule} from 'primeng/listbox';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SliderModule,
    ButtonModule,
    ListboxModule
],
  providers: [IdpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
