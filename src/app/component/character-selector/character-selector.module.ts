import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { CharacterSelectorComponent } from './character-selector.component';
import './character-selector.scss';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatIconModule,
        MatMenuModule
    ],
    declarations: [
        CharacterSelectorComponent
    ],
    exports: [
        CharacterSelectorComponent
    ]
})
export class CharacterSelectorModule {}