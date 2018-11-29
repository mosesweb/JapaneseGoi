import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';
import * as appSettings from 'application-settings';
import {
  request,
  getFile,
  getImage,
  getJSON,
  getString,
  HttpRequestOptions,
  HttpResponse
} from 'tns-core-modules/http';

@Injectable()
export class UserService {
  getAllUsers = (): Observable<Array<User>> => {
    return of([{ name: 'Moses'}, { name: 'Someone'}]);
  };
  getUserName = () : User => 
  {
    return { name: "" };
  }

  

}
