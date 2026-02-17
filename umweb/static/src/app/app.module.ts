import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterComponent } from './includes/footer/footer.component';
import { HeaderComponent } from './includes/header/header.component';
import { MatModule } from './modules/mat/mat.module';
import { InfoComponent } from './includes/utilities/popups/info/info.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WaitComponent } from './includes/utilities/popups/wait/wait.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    InfoComponent,
    WaitComponent
  ],
  imports: [
    FormsModule,
    ReactiveFormsModule,
    BrowserModule,
    BrowserAnimationsModule,
    MatTooltipModule,
    AppRoutingModule,
    MatModule,
    HttpClientModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
