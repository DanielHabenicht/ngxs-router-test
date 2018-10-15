import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TestComponent1Component } from './test-component1/test-component1.component';
import { TestComponent2Component } from './test-component2/test-component2.component';

@NgModule({
  declarations: [
    AppComponent,
    TestComponent1Component,
    TestComponent2Component
  ],
  imports: [
    BrowserModule,
    AppRoutingModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
