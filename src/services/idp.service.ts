import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {RemoteIdpCall, RemoteIdpResponse} from '../domain/remote-data';
import {AppSettings} from './AppSettings';
import {Observable} from 'rxjs';
import {AppInfo} from '../domain/metaInfo';

@Injectable()
export class IdpService {

  constructor(
    private http: HttpClient,
  ) {
  }

  public getMetaFile(): Observable<string> {
    return this.http.get(AppSettings.META_URL, {responseType: 'text'});
  }

  public getSpecification(): Observable<string> {
    return this.http.get(AppSettings.SPECIFICATION_URL, {responseType: 'text'});
  }

  public getAppInfo(): Observable<AppInfo> {
    // Parse Meta File!
    return null;
  }

  public callIDP(code: string): Observable<RemoteIdpResponse> {
    const x = new RemoteIdpCall(code);
    return this.http.post<RemoteIdpResponse>(AppSettings.IDP_ENDPOINT, x);
  }
}
