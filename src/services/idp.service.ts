import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RemoteIdpCall, RemoteIdpResponse} from '../domain/remote-data';
import {AppSettings} from './AppSettings';
import {Observable} from 'rxjs';

@Injectable()
export class IdpService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getCSV(): Observable<string> {
    return this.http.get(AppSettings.META_URL, {responseType: 'text'});
  }

  public getSpecification(): Observable<string> {
    return this.http.get(AppSettings.SPECIFICATION_URL, {responseType: 'text'});
  }

  public callIDP(code: string): Observable<RemoteIdpResponse> {
    const x = new RemoteIdpCall(code);
    return this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, x);
  }
}
