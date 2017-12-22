'use strict';
import {Injectable} from '@angular/core';
import {Observable} from 'rxjs/Rx';
import {TaskService} from './';

@Injectable()
export class IndexedDbService {
    private DBWrapper: DBWrapper;

    // private taskService: TaskService;

    constructor() {
        this.DBWrapper = new DBWrapper();
        this.DBWrapper.DbName = 'TsDb';
        this.DBWrapper.DbVersion = 1;
        this.DBWrapper.indexedDB = window.indexedDB
            || (<any>window).mozIndexedDB
            || (<any>window).webkitIndexedDB
            || (<any>window).msIndexedDB;
    }

    createObjectStore() {
        const self = this;
        const storeName = 'tasks_' + JSON.parse(localStorage.getItem('userInfo'))['facebookId'];
        const promise = new Promise<any>((resolve, reject) => {
            const request = self.DBWrapper.indexedDB.open(self.DBWrapper.DbName, self.DBWrapper.DbVersion);

            request.onsuccess = function (e) {
                self.DBWrapper.DB = request.result;
                resolve(storeName);
            };

            request.onerror = function (e) {
                reject('IndexedDB error: ' + e.target.errorCode);
            };

            request.onupgradeneeded = function (e) {
                const objectStore = e.currentTarget.result.createObjectStore(
                    storeName, {keyPath: 'idb_ID', autoIncrement: true});
                objectStore.createIndex('title', 'title', {unique: false});
                objectStore.createIndex('sync', 'sync', {unique: false});
                objectStore.createIndex('sql_id', 'sql_id', {unique: true});
            };
        });
        return promise;
    }

    getAll(storeName: string) {
        const self = this;
        const promise = new Promise<any>(prFunc);

        function prFunc(resolve, reject) {
            self.DBWrapper.validateBeforeTransaction(storeName, reject);
            const transaction = self.DBWrapper.createTransaction({
                    storeName: storeName,
                    dbMode: 'readonly',
                    error: (e: Event) => {
                        reject(e);
                    },
                    complete: (e: Event) => {
                        resolve(result);
                    }
                }),
                objectStore = transaction.objectStore(storeName),
                result = [],
                request = objectStore.openCursor();

            request.onerror = function (e) {
                reject(e);
            };

            request.onsuccess = function (evt) {
                const cursor = (<IDBOpenDBRequest>evt.target).result;
                if (cursor) {
                    result.push(cursor.value);
                    cursor['continue']();
                }
            };
        }

        return promise;
    }

    add(storeName: string, value: any, key?: any) {
        const self = this;
        const promise = new Promise<any>(PrFunc);

        function PrFunc(resolve, reject) {
            const transaction = self.DBWrapper.createTransaction({
                    storeName: storeName,
                    dbMode: 'readwrite',
                    error: (e: Event) => {
                        reject(e);
                    },
                    complete: (e: Event) => {
                        resolve({key: key, value: value});
                    }
                }),
                objectStore = transaction.objectStore(storeName);

            objectStore.add(value, key);
        }

        return promise;
    }

    filterByIndex(storeName: string, indexName: string, value: any) {
        const self = this;
        const promise = new Promise<any>((resolve, reject) => {
            self.DBWrapper.validateBeforeTransaction(storeName, reject);

            const transaction = self.DBWrapper.createTransaction({
                    storeName: storeName,
                    dbMode: 'readonly',
                    error: (e: Event) => {
                        reject(e);
                    },
                    complete: (e: Event) => {
                        resolve(result);
                    },
                    abort: (e: Event) => {
                        reject(e);
                    }
                }),
                result = [],
                objectStore = transaction.objectStore(storeName),
                singleKeyRange = IDBKeyRange.only('false'),
                index = objectStore.index('sync');

            index.openCursor(singleKeyRange).onsuccess = function (event) {
                const cursor = (<IDBOpenDBRequest>event.target).result;
                if (cursor) {
                    // cursor.key is a name, like "Bill", and cursor.value is the whole object.
                    result.push(cursor.value);
                    cursor.continue();
                }
            };
        });
        return promise;
    }

    update(value: any, key: any) {
        const self = this;
        const storeName = 'tasks_' + JSON.parse(localStorage.getItem('userInfo'))['facebookId'];
        const promise = new Promise<any>((resolve, reject) => {
            self.DBWrapper.validateBeforeTransaction(storeName, reject);

            const transaction = self.DBWrapper.createTransaction({
                    storeName: storeName,
                    dbMode: 'readwrite',
                    error: (e: Event) => {
                        reject(e);
                    },
                    complete: (e: Event) => {
                        resolve(value);
                    },
                    abort: (e: Event) => {
                        reject(e);
                    }
                }),
                objectStore = transaction.objectStore(storeName);

            objectStore.put(value, key);
        });

        return promise;
    }


    deleteValue(storeName: string, key: any) {
        const self = this;
        const promise = new Promise<any>((resolve, reject) => {
            self.DBWrapper.validateBeforeTransaction(storeName, reject);

            const transaction = self.DBWrapper.createTransaction({
                    storeName: storeName,
                    dbMode: 'readwrite',
                    error: (e: Event) => {
                        reject(e);
                    },
                    complete: (e: Event) => {
                        resolve();
                    },
                    abort: (e: Event) => {
                        reject(e);
                    }
                }),
                objectStore = transaction.objectStore(storeName);

            objectStore['delete'](key);
        });
    }

    // serverSync(note){
    //    const self= this;
    //    const responsefrmServer: Observable<Object>= self.taskService.taskUpload(note);
    //    responsefrmServer.subscribe(funcSuccess, funcError);
    //
    //    function funcSuccess(response){
    //      console.log(response);
    //      note.sync= 'true';
    //      note.mongo_id = response['id'];
    //      self.update(note, note.key).then((response)=> {
    //        console.log(response)
    //      } ,  funcError );
    //    }
    //    function funcError(error){
    //      console.log(error);
    //    }
    //  }
    //
    // TODO rajesh
    // This function will be called to sync IndexedDB with server data, input: array of tasks
    syncIndexedDB(notes: any[]) {
        const self = this;
        if (notes.length) {
            for (let i = 0; i < notes.length; i++) {
                const note: any = notes[i];
                note.sync = 'true';
                note.sql_id = notes[i]['primaryId'];
                self.update(note, note.key).then((res) => {
                    console.log(res);
                }, (err) => {
                    console.log(err);
                });
            }
        }
    }
}


class DBWrapper {
    public indexedDB: any;
    public DbVersion: number;
    public DbName: string;
    public DB: IDBDatabase;

    validateStoreName(storeName) {
        return this.DB.objectStoreNames.contains(storeName);
    }

    validateBeforeTransaction(storeName: string, reject) {
        if (!this.DB) {
            reject('You need to use the createStore function to create a database before you query it!');
        }
        if (!this.validateStoreName(storeName)) {
            reject(('objectStore does not exists: ' + storeName));
        }
    }

    createTransaction(options: {
        storeName: string,
        dbMode: IDBTransactionMode,
        error: (e: Event) => any, complete: (e: Event) => any,
        abort?: (e: Event) => any
    }): IDBTransaction {
        const trans: IDBTransaction = this.DB.transaction(options.storeName, options.dbMode);
        trans.onerror = options.error;
        trans.oncomplete = options.complete;
        trans.onabort = options.abort;
        return trans;
    }
}
