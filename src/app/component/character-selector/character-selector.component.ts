import { Component } from '@angular/core';

import template from './character-selector.html';
import mickeyMouseImage from './../../../assets/images/mickey-mouse.png';
import minnieMouseImage from './../../../assets/images/minnie-mouse.png';
import donaldDuckImage from './../../../assets/images/donald-duck.png';
import daisyDuckImage from './../../../assets/images/daisy-duck.png';
import goofyImage from './../../../assets/images/goofy.png';
import plutoImage from './../../../assets/images/pluto.png';
import aladdinImage from './../../../assets/images/aladdin.png';
import aliceImage from './../../../assets/images/alice.png';
import anaDrizImage from './../../../assets/images/anastasia-drizella.png';
import beastImage from './../../../assets/images/beast.png';
import belleImage from './../../../assets/images/belle.png';
import chipDaleImage from './../../../assets/images/chip-dale.png';
import cinderellaImage from './../../../assets/images/cinderella.png';
import elenaImage from './../../../assets/images/elena.png';
import gastonImage from './../../../assets/images/gaston.png';
import jasmineImage from './../../../assets/images/jasmine.png';
import meridaImage from './../../../assets/images/merida.png';

interface Character {
    name: string,
    image?: string,
    id: number
}

@Component({
    selector: 'character-selector',
    template
})
export class CharacterSelectorComponent {
    character_list: Character[];
    private db: IDBDatabase;
    // letters: string[];

    constructor() {
        this.character_list = [
            {
                name: 'Mickey Mouse',
                image: mickeyMouseImage
            }, {
                name: 'Minnie Mouse',
                image: minnieMouseImage
            }, {
                name: 'Daisy Duck',
                image: daisyDuckImage
            }, {
                name: 'Donald Duck',
                image: donaldDuckImage
            }, {
                name: 'Goofy',
                image: goofyImage
            }, {
                name: 'Pluto',
                image: plutoImage
            }, {
                name: 'Aladdin',
                image: aladdinImage
            }, {
                name: 'Alice',
                image: aliceImage
            }, {
                name: 'Anastasia and Drizella',
                image: anaDrizImage
            }, {
                name: 'Beast',
                image: beastImage
            }, {
                name: 'Belle',
                image: belleImage
            }, {
                name: 'Chip and Dale',
                image: chipDaleImage
            }, {
                name: 'Cinderella',
                image: cinderellaImage
            }, {
                name: 'Elena',
                image: elenaImage
            }, {
                name: 'Gaston',
                image: gastonImage
            }, {
                name: 'Jasmine',
                image: jasmineImage
            }, {
                name: 'Merida',
                image: meridaImage
            }
        ].map(c => {
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
        // this.letters = ['A','B','C','D','E','F','G'];
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