import { Component } from '@angular/core';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { Character, Characters } from './characters';

import template from './character-selector.html';
import confirmDelete from './confirm-delete.html';

@Component({
    selector: 'character-selector',
    template
})
export class CharacterSelectorComponent {
    character_list: Character[];
    private db: IDBDatabase;

    constructor(public dialog: MatDialog) {
        this.character_list = Characters.map(c => {
            return {
                name: c.name,
                image: c.image,
                id: undefined
            }
        }).sort((a, b) => {
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
        this.createDatabase();
    }

    private createDatabase() {
        let request: IDBOpenDBRequest = window.indexedDB.open('character_db', 1);

        request.onerror = (e) => console.log(e);
        request.onsuccess = () => {
            this.db = request.result;
            this.getCharacterInfo();
        };
        request.onupgradeneeded = (e: IDBVersionChangeEvent) => {
            let target: any = e.target;
            let db: IDBDatabase = target.result;
            let objectStore = db.createObjectStore('character_db', { keyPath: 'id', autoIncrement: true });
            objectStore.createIndex('name', 'name', { unique: true });
        };
    }

    private clearDatabase() {
        let _this = this;
        let objectStore = this.db.transaction(['character_db'], 'readwrite').objectStore('character_db');

        let request = objectStore.clear();
        request.onsuccess = () => {
            _this.character_list.map(character => {
                character.id = undefined;
                return character;
            })
        };
    }

    private getCharacterInfo() {
        let objectStore = this.db.transaction('character_db').objectStore('character_db');
        let _this = this;
        objectStore.openCursor().onsuccess = (e: Event) => {
            let target: any = e.target;
            let cursor: IDBCursorWithValue = target.result;

            if (cursor) {
                _this.character_list.map(character => {
                    if (character.name === cursor.value.name) {
                        character.id = cursor.value.id;
                    }
                    return character;
                });
                cursor.continue();
            }
        };
    }

    openDialog(): void {
        const dialogRef = this.dialog.open(ConfirmDeleteDialog);

        dialogRef.afterClosed().subscribe(result => {
            if (result) {
                this.clearDatabase();
            }
        });
    }

    updateCharacter(character: Character) {
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
            };
            transaction.onerror = (e) => {
                console.error(e);
            }
        } else {
            let newItem = { name: character.name };
            let request = objectStore.add(newItem);
            let cid: number;

            request.onsuccess = (e) => {
                let target: any = e.target;
                cid = target.result;
            }
            transaction.oncomplete = (e) => {
                _this.character_list.map(c => {
                    if (c.name === character.name) {
                        character.id = cid;
                    }
                    return character;
                });
            };
            transaction.onerror = (e) => {
                console.error(e);
            }
        }
    }
}

@Component({
    selector: 'confirm-delete',
    template: confirmDelete,
})
export class ConfirmDeleteDialog {

    constructor(public dialogRef: MatDialogRef<ConfirmDeleteDialog>) { }

    onNoClick(): void {
        this.dialogRef.close();
    }
}