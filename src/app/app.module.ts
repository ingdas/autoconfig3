import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {IdpService} from '../services/idp.service';
import {HttpClientModule} from '@angular/common/http';
import {SliderModule} from 'primeng/slider';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SliderModule
  ],
  providers: [IdpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
