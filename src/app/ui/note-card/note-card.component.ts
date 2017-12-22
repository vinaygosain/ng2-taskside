import {Component, Input, Output, EventEmitter} from '@angular/core';
import {Router} from '@angular/router';
import {MatDialog, MatDialogRef} from '@angular/material';

@Component({
    selector: 'ts-note-card',
    styleUrls: ['./note-card.component.css'],
    templateUrl: './note-card.component.html'
})

export class NoteCardComponent {
    @Input() note = {};
    @Output() noteDeleted = new EventEmitter();
    selectedOption: string;

    constructor(private router: Router, public dialog: MatDialog) {
    }

    openDialog() {
        const dialogRef = this.dialog.open(DialogResultExampleDialog);
        dialogRef.componentInstance.note = this.note;

        dialogRef.afterClosed().subscribe(result => {
            this.selectedOption = result;
            if (result === 'deleteNote') {
                this.noteDeleted.next(this.note);
            }
        });
    }
}

@Component({
    selector: 'dialog-result-example-dialog',
    styleUrls: ['./dialog.css'],
    templateUrl: './dialog.html',
})
export class DialogResultExampleDialog {
    note: Object;

    constructor(public dialogRef: MatDialogRef<DialogResultExampleDialog>) {
    }

    deleteNote() {
        this.dialogRef.close('deleteNote');
        //  this.noteDeleted.next(this.note);
    }
}
