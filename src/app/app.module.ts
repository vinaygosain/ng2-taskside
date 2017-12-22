import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {HttpModule} from '@angular/http';
import {RouterModule} from '@angular/router';
import {FacebookService} from 'ngx-facebook';
import {SidebarModule} from 'ng2-sidebar';
import {
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatListModule,
    MatInputModule,
} from '@angular/material';
import 'hammerjs';

// Component describing pages
import {
    LoginComponent,
    LandingComponent,
    TaskDetailComponent
} from './pages';

import {AppComponent} from './app.component';
import {NoteContainerComponent} from './containers';
import {
    NoteCreatorComponent,
    AppBarComponent,
    DialogResultExampleDialog,
    NoteCardComponent,
    FbLoginComponent
} from './ui';

import {Shared} from './shared';

// custom services
import {
    UserService,
    IndexedDbService,
    TaskService,
    LoggedInGuard,
    AuthenticationService
} from './Services';


@NgModule({
    declarations: [
        AppComponent,
        LoginComponent,
        LandingComponent,
        TaskDetailComponent,
        AppBarComponent,
        NoteContainerComponent,
        NoteCardComponent,
        DialogResultExampleDialog,
        NoteCreatorComponent,
        FbLoginComponent,
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        FormsModule,
        HttpModule,
        MatButtonModule,
        MatCheckboxModule,
        MatIconModule,
        MatListModule,
        MatInputModule,
        RouterModule.forRoot([
            {path: 'home', component: LandingComponent, canActivate: [LoggedInGuard]},
            {path: 'login', component: LoginComponent},
            {path: 'detail', component: TaskDetailComponent, canActivate: [LoggedInGuard]},
            {path: '**', component: LandingComponent, canActivate: [LoggedInGuard]}
        ]),
        SidebarModule
    ],
    entryComponents: [
        DialogResultExampleDialog
    ],
    providers: [FacebookService, UserService, Shared, LoggedInGuard, AuthenticationService, TaskService, IndexedDbService],
    bootstrap: [AppComponent]
})
export class AppModule {
}
