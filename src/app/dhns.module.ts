import { NgModule } from '@angular/core';
import { FlexLayoutModule } from '@angular/flex-layout';
import { FormsModule } from '@angular/forms';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { ComponentModule } from './component/component.module';
import { DHNSComponent } from './dhns.component';
import './dhns.scss';

@NgModule({
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FlexLayoutModule,
        FormsModule,
        ComponentModule
    ],
    declarations: [
        DHNSComponent
    ],
    bootstrap: [
        DHNSComponent
    ]
})
export class AppModule {}