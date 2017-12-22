import { Component,
  AfterViewChecked,
  OnInit } from '@angular/core';
  import { Observable } from 'rxjs/Rx';

  import {
    NoteCardComponent,
    NoteCreatorComponent
  } from '../../ui';

  import { IndexedDbService,
    TaskService } from '../../Services';
    //  import { TaskService } from '../../Services/task.service';

    declare var Packery: any;

    @Component({
      selector: 'ts-note-container',
      styleUrls: ['./note-container.component.css'],
      templateUrl: './note-container.component.html'
    })
    export class NoteContainerComponent implements OnInit, AfterViewChecked {
      public notes = [];
      //public dbService= null;
      public storeName:string= null;

      constructor(public dbService: IndexedDbService,public taskService:TaskService){
        //  this.dbService= new IndexedDbService('TsDb', 1);
      }

      ngOnInit() {
        this.initNotes();
        //  this.notesServerSync();
        this.getLatestTasks();
        //this.getDeletedTasks();
        //this.deleteTask('task_ID_HERE');
      }

      initNotes(){
        let self= this;
        self.dbService.createObjectStore().then(( storeName ) => {
          self.storeName= storeName;
          self.getNotes();
          self.notesServerSync();
        });
      }

      getNotes(){
        let self= this;
        self.dbService.getAll(self.storeName).then(( tasks ) => {
          self.notes= tasks;
        }, (error) => {
          console.log(error);
        });
      }

      ngAfterViewChecked(){
        this.initGrid();
      }

      initGrid(){
        var elem = document.querySelector('.grid');
        var pckry = new Packery( elem, {
          // options
          itemSelector: '.grid-item',
          gutter: 10,
        });
      }

      onNoteCreated(note){
        let self= this;
        self.dbService.add( self.storeName, { title: note.title, value: note.value, sync: 'false' }).then(( response ) => {
          self.notes.push(note);
          self.notesServerSync();
          //self.getNotes();
        }, (error) => {
          console.log(error);
        });
      }

      onNoteDeleted(note){
      }

      notesServerSync(){
        let self= this;
        let storeName= 'tasks_' +  JSON.parse(localStorage.getItem('userInfo'))['facebookId'];
        this.dbService.filterByIndex(storeName, 'sync', 'false').then(funcSuccess, (err)=> this.funcFailure(err));

         function funcSuccess(response){
          for(let i=0; i<response.length; i++){
            let note= response[i];
            let responsefrmServer: Observable<Object>= self.taskService.taskUpload(note);
            responsefrmServer.subscribe( res=> {
              note.sync= 'true';
              note.sql_id = res['primaryId'];
              self.dbService.update(note, note.key);
          });
        }
      }
    }

      getLatestTasks(){
        let latestTasks:Observable<Object>  =  this.taskService.getUnsyncedTaskFromServer();
        latestTasks.subscribe(res=> this.funcSuccess(res), err=> this.funcFailure(err));
      }

      deleteTask(_taskId:string){
        let self= this;
        let deletedTask:Observable<Object> = self.taskService.deleteTaskById(_taskId);
        deletedTask.subscribe(res => self.funcSuccess(res), err => self.funcFailure(err));
      }

      funcSuccess(res:any){
      let self = this;
      console.log(res);
      //After successfully fetching unsynced tasks from server, add them to indexedDB. --TODO
      localStorage.setItem('lastSync', new Date().getTime().toString());
      self.dbService.syncIndexedDB(res);
      self.notes= self.notes.concat(res);
    }

      funcFailure(error:any){
      console.log(error);
    }

    getDeletedTasks(){
      let last_deleted_sync = localStorage.getItem('last_deleted_sync');
      if(last_deleted_sync){
        let deletedTasks: Observable<Object> =  this.taskService.getDeletedTasks(last_deleted_sync);
        deletedTasks.subscribe(()=> this.funcDeleteTasks);
      }
    }
    funcDeleteTasks(res){
      for(let i =0; i< res.length; i++){
      this.dbService.deleteValue(this.storeName, res[i].primaryId);
     }
    }
    }
