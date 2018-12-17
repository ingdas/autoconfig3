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
import {SymbolComponent} from './configurator/symbol/symbol.component';
import {ConfiguratorComponent} from './configurator/configurator.component';
import {CommonModule} from '@angular/common';
import {DialogModule, OverlayPanelModule, PanelModule, SelectButtonModule, SplitButtonModule, TooltipModule} from 'primeng/primeng';
import {FlexLayoutModule} from '@angular/flex-layout';
import {RouterModule} from '@angular/router';
import {SymbolValueComponent} from './configurator/symbol/symbol-value/symbol-value.component';
import {SymbolHeaderComponent} from './configurator/symbol/symbol-header/symbol-header.component';
import {SymbolValueSelectorComponent} from './configurator/symbol/symbol-value/symbol-value-selector/symbol-value-selector.component';
import {ConfigurationService} from '../services/configuration.service';
import {ShowparamComponent} from './configurator/showparam/showparam.component';
import {ShowexplainComponent} from './configurator/showexplain/showexplain.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    SymbolComponent,
    ConfiguratorComponent,
    SymbolValueComponent,
    SymbolHeaderComponent,
    SymbolValueSelectorComponent,
    ShowparamComponent,
    ShowexplainComponent
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
    OverlayPanelModule,
    RouterModule.forRoot([{path: '', component: AppModule}])
  ],
  providers: [IdpService, ConfigurationService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
