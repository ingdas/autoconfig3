import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {IdpService} from '../services/idp.service';
import {HttpClientModule} from '@angular/common/http';
import {SliderModule} from 'primeng/slider';
import {FormsModule} from '@angular/forms';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {ButtonModule} from 'primeng/button';
import {HeaderComponent} from './header/header.component';
import {ListboxModule} from 'primeng/listbox';
import {SymbolComponent} from './symbol/symbol.component';
import {ConfiguratorComponent} from './configurator/configurator.component';
import {CommonModule} from '@angular/common';
import {DialogModule, OverlayPanelModule, PanelModule, SelectButtonModule, SplitButtonModule, TooltipModule} from 'primeng/primeng';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {ValueComponent} from './symbol/value/value.component';
import {SymbolHeaderComponent} from './symbol/symbol-header/symbol-header.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SymbolComponent,
    ConfiguratorComponent,
    ValueComponent,
    SymbolHeaderComponent
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
    SelectButtonModule,
    FlexLayoutModule,
    PanelModule,
    SplitButtonModule,
    TooltipModule,
    DialogModule,
    RouterModule.forRoot([{path: '', component: AppModule}])
  ],
  providers: [IdpService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
