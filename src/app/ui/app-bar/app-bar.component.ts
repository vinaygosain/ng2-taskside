import { Component } from '@angular/core';
import { SidebarModule } from 'ng2-sidebar';

@Component({
selector: 'ts-app-bar',
styleUrls: [ './app-bar.component.css' ],
templateUrl: './app-bar.component.html'
})

export class AppBarComponent {
private _open: boolean = false;

 private _toggleSidebar() {
   this._open = !this._open;
 }
}
