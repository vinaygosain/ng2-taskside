import {Component} from '@angular/core';
import {FacebookService, InitParams} from 'ngx-facebook';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css'],
})

export class AppComponent {

    constructor(private fb: FacebookService) {
        const fbParams: InitParams = {
            appId: '137356923715158',
            version: 'v2.11'
        };
        fb.init(fbParams);
    }
}
