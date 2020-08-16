import { Component } from '@angular/core';
import { Character, Characters } from './characters';

import template from './character-selector.html';

@Component({
    selector: 'character-selector',
    template
})
export class CharacterSelectorComponent {
    character_list: Character[];
    private db: IDBDatabase;

    constructor() {
        this.character_list = Characters.map(c => {
            return {
                name: c.name,
                image: c.image,
                id: undefined
            }
        }).sort((a,b) => {
            if (a.name.toLowerCase() <= b.name.toLowerCase()) {
                return -1;
            }
            if (a.name.toLowerCase() >= b.name.toLowerCase()) {
                return 1;
            }
            return 0;
        });
    }

    ngOnInit() {
        let request: IDBOpenDBRequest = window.indexedDB.open('character_db', 1);

        request.onerror = () => console.log('Error opening db.');
        request.onsuccess = () => {
            console.log('Successfully opened db.');
            this.db = request.result;
            this.getCharacterInfo();
        };
        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            let target: any = e.target;
            let db: IDBDatabase = target.result;
            let objectStore = db.createObjectStore('character_db', { keyPath: 'id', autoIncrement: true });

            objectStore.createIndex('name', 'name', { unique: true });

            console.log('Database setup complete');
        };
    }

    private getCharacterInfo() {
        let objectStore = this.db.transaction('character_db').objectStore('character_db');
        let _this = this;
        objectStore.openCursor().onsuccess = (e: Event) => {
            console.log('Opening cursor.')
            let target: any = e.target;
            let cursor: IDBCursorWithValue = target.result;

            if (cursor) {
                console.log('Found cursor.');
                console.log(cursor.value.name);
                console.log(cursor.value.id);
                _this.character_list.map(character => {
                    if (character.name === cursor.value.name) {
                        character.id = cursor.value.id;
                    }
                    return character;
                });
                cursor.continue();
            } else {
                console.log('All characters set.');
            }
        };
    }

    updateCharacter(character: Character) {
        console.log('updateCharacter');
        console.log(character);

        let _this = this;
        let transaction = this.db.transaction(['character_db'], 'readwrite');
        let objectStore = transaction.objectStore('character_db');

        if (character.id) {
            let request = objectStore.delete(character.id);

            request.onsuccess = () => console.log('Delete request was successful');
            transaction.oncomplete = () => {
                _this.character_list.map(c => {
                    if (c.name === character.name) {
                        character.id = undefined;
                    }
                    return character;
                });
                console.log(`Character ${character.name} deleted.`);
            };
            transaction.onerror = (e) => {
                console.error('Transaction not opened due to error.');
                console.error(e);
            }
        } else {
            let newItem = { name: character.name };

            let request = objectStore.add(newItem);
            let cid;

            request.onsuccess = (e) => {
                let target: any = e.target;
                cid = target.result;
                console.log('Add request was successful');
            }
            transaction.oncomplete = (e) => {
                _this.character_list.map(c => {
                    if (c.name === character.name) {
                        character.id = cid;
                    }
                    return character;
                });
                console.log(`Character ${character.name} added.`);
            };
            transaction.onerror = (e) => {
                console.error('Transaction not opened due to error.');
                console.error(e);
            }
        }
    }
}