import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';

import { CharacterSelectorComponent, ConfirmDeleteDialog } from './character-selector.component';
import './character-selector.scss';

@NgModule({
    imports: [
        CommonModule,
        MatButtonModule,
        MatButtonToggleModule,
        MatDialogModule,
        MatIconModule,
        MatMenuModule
    ],
    declarations: [
        CharacterSelectorComponent,
        ConfirmDeleteDialog
    ],
    entryComponents: [
        ConfirmDeleteDialog
    ],
    exports: [
        CharacterSelectorComponent,
        ConfirmDeleteDialog
    ]
})
export class CharacterSelectorModule {}