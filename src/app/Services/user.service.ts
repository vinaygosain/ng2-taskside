import {Injectable, Inject} from '@angular/core';
import {Http, Response, Headers, RequestOptions} from '@angular/http';
import {Observable} from 'rxjs/Rx';
import 'rxjs/Rx';

import {Shared} from '../shared';

@Injectable()

export class UserService {

    constructor(private http: Http, private Shared: Shared) {
    }

    registerUser(accessToken): Observable<Object> {
        const body = JSON.stringify({access_token: accessToken});
        const headers = new Headers({'Content-Type': 'application/json'});
        const options = new RequestOptions({headers: headers});
        const url = this.Shared.API_BASEURL + '/user';

        return this.http.post(url, body, options)
            .map(this.extractData)
            .catch(this.handleError);
    }

    private extractData(res: Response) {
        const body = res.json();
        return body || {};
    }

    private handleError(error: any) {
        return Observable.throw(error);
    }
}

class User {
    name: string;
    facebookId: number;
    email: string;
}
