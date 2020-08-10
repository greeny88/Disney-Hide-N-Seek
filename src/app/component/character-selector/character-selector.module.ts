import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

import { CharacterSelectorComponent } from './character-selector.component';
import './character-selector.scss';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule
    ],
    declarations: [
        CharacterSelectorComponent
    ],
    exports: [
        CharacterSelectorComponent
    ]
})
export class CharacterSelectorModule {}