'use strict';

import {Injectable, Inject, ReflectiveInjector} from '@angular/core';
import {
    Http,
    URLSearchParams,
    Response,
    Headers,
    RequestOptions,
    XHRConnection,
    XHRBackend,
    ConnectionBackend,
    BrowserXhr,
    ResponseOptions,
    XSRFStrategy,
    CookieXSRFStrategy,
    BaseResponseOptions,
    BaseRequestOptions
} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import {} from 'rxjs/add/operator/map';
import 'rxjs/Rx';

// for shared variables
import {Shared} from '../shared';

class MyCookieXSRFStrategy extends CookieXSRFStrategy {
}

@Injectable()
export class TaskService {
    private Shared;

    constructor(public http: Http) {
        this.Shared = new Shared();
    }

    //  Delete single task from server
    deleteTaskById(taskId: string): Observable<Object> {
        //  request 'DELETE /Task/:TaskId/:fbId'
        const self = this;
        const fbId = JSON.parse(localStorage.getItem('userInfo'))['facebookId'];
        const accesstoken = localStorage.getItem('permanent_Token');
        const body = JSON.stringify({access_token: accesstoken});
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers, body: body});
        const url = self.Shared.API_BASEURL + '/task/' + taskId + '/' + fbId;
        return self.http.delete(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    // Get unsynched tasks from server
    getUnsyncedTaskFromServer(): Observable<Object> {
        // request : 'GET /Task/:time/:fbId'
        const self = this;
        const fbId = JSON.parse(localStorage.getItem('userInfo'))['facebookId'];
        const timeStamp = localStorage.getItem('lastSync') === null ? '0000000000000' : localStorage.getItem('lastSync');

        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const url = self.Shared.API_BASEURL + '/task/' + timeStamp + '/' + fbId;

        return self.http.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    }


    taskUpload(note: any): Observable<Object> {
        const self = this;
        const accesstoken = localStorage.getItem('permanent_Token');
        const body = JSON.stringify({access_token: accesstoken, task: note});
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers});
        const url = self.Shared.API_BASEURL + '/task';
        return self.http.post(url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    getDeletedTasks(last_deleted_sync): Observable<Object> {
        const self = this;
        const fbId = JSON.parse(localStorage.getItem('userInfo'))['facebookId'];
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const url = self.Shared.API_BASEURL + '/deletedtasks/' + last_deleted_sync + '/' + fbId;

        return self.http.get(url, options)
            .map(this.extractData)
            .catch(this.handleError);
    }


    private extractData(res: Response) {
        const body = res.json();
        console.log(res);
        // Set lastSync only after successful getUnsyncedTaskFromServer --TODO
        // set lastsync only after successful insertion in indexeddb ,otherwise it is of no use --TODO
        return body || {};
    }

    private handleError(error: any) {
        console.log(error);
        return Observable.throw(new Error(error.status));
    }
}
