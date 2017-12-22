import { Component,
          Output,
          EventEmitter } from '@angular/core';

@Component({
selector: 'ts-note-creator',
styleUrls: [ 'note-creator.component.css' ],
templateUrl: 'note-creator.component.html'
})

export class NoteCreatorComponent{

@Output() noteCreated = new EventEmitter();
newNote = { title: "", value: "" };

OnCreateNote(){
const { title, value } = this.newNote;

if( title && value ){
  this.noteCreated.next({ title, value });
      this.newNote={
      title:"",
      value:""
      }
    }
  }
}
