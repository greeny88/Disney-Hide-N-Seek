import { Component } from '@angular/core';

import template from './character-selector.html';

interface Character {
    name: String,
    id: number
}

@Component({
    selector: 'character-selector',
    template
})
export class CharacterSelectorComponent {
    characters: String[];
    character_list: Character[];
    private db: IDBDatabase;

    constructor() {
        this.characters = [
            'Mickey Mouse',
            'Minnie Mouse',
            'Donald Duck',
            'Daisy Duck',
            'Goofy',
            'Pluto',
            'Chip and Dale',
            'Snow White',
            'Belle',
            'Cinderella',
            'Elsa',
            'Anna',
            'Ariel'
        ];
        this.character_list = this.characters.sort().map((c) => {
            return { name: c, id: undefined };
        });
    }

    
    // https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Client-side_web_APIs/Client-side_storage#Storing_complex_data_%E2%80%94_IndexedDB
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
        objectStore.openCursor().onsuccess = (e: Event) => {
            console.log('Opening cursor.')
            let target: any = e.target;
            let cursor: IDBCursorWithValue = target.result;

            if (cursor) {
                console.log('Found cursor.');
                console.log(cursor.value.name);
                console.log(cursor.value.id);
                this.character_list.map(character => {
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

    updateCharacter(character) {
        console.log('updateCharacter');
        console.log(character);

        let transaction = this.db.transaction(['character_db'], 'readwrite');
        let objectStore = transaction.objectStore('character_db');

        if (character.id) {
            let request = objectStore.delete(character.id);

            request.onsuccess = () => console.log('Request was successful');
            transaction.oncomplete = (() => {
                this.character_list.map(c => {
                    if (c.name === character.name) {
                        character.id = undefined;
                    }
                    return character;
                });
                console.log(`Note ${character.id} deleted.`);
            }).call(this);
            transaction.onerror = (e) => console.log(`Transaction not opened due to error. ${e}`);
        } else {
            let newItem = { name: character.name };

            let request = objectStore.add(newItem);

            request.onsuccess = () => console.log('Request was successful');
            transaction.oncomplete = (() => {
                this.character_list.map(c => {
                    if (c.name === character.name) {
                        character.id = c.id;
                    }
                    return character;
                });
                console.log('Transaction completed: database modification finished.');
            }).call(this);
            transaction.onerror = (e) => console.log(`Transaction not opened due to error. ${e}`);
        }
    }
}