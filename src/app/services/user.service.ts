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
const firebase = require("nativescript-plugin-firebase")

@Injectable()
export class UserService {
  getAllUsers = (): Observable<Array<User>> => {
    return;
  };
  getUserName = () : Observable<string> => 
  {
    let auser;
    return;

  }

  

}
