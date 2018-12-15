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
import { SymbolComponent } from './symbol/symbol.component';
import { ConfiguratorComponent } from './configurator/configurator.component';
import {CommonModule} from '@angular/common';
import {SelectButtonModule} from 'primeng/primeng';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SymbolComponent,
    ConfiguratorComponent
  ],
  imports: [
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    FormsModule,
    SliderModule,
    ButtonModule,
    ListboxModule,
    SelectButtonModule
],
  providers: [IdpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
