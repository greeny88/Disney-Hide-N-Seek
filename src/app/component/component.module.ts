import { NgModule } from '@angular/core';

import { CharacterSelectorModule } from './character-selector/character-selector.module';

@NgModule({
    imports: [
        CharacterSelectorModule
    ],
    exports: [
        CharacterSelectorModule
    ]
})
export class ComponentModule {}