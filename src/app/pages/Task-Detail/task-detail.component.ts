import { Component } from '@angular/core';
import { Router} from '@angular/router';

@Component({
  selector: 'ts-task-detail',
  styleUrls: [ './task-detail.component.css' ],
  templateUrl: './task-detail.component.html'
})

export class TaskDetailComponent{

constructor( private router: Router ) {}

private Back(){
  this.router.navigate(['/home']);
}

}
