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
import { searchResponse } from '../model/searchResponse.model';
import { searchResponseProxy } from '../model/searchResponseProxy';
const firebase = require("nativescript-plugin-firebase");
const http = require('http');

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
  search = (searchtag : string) : string => 
  {
    if(searchtag != "")
    {
      getJSON("https://jisho.org/api/v1/search/words?keyword=" + searchtag).then((r: any) => 
      {
        
        let whatisthis = searchResponseProxy.Create(r);
        console.log(whatisthis.data.length);
        whatisthis.data.forEach(function (searchResponse) {
          searchResponse.japanese.forEach(function(searchResponseJapanese) {
            console.log(searchResponseJapanese.word);
            console.log(searchResponseJapanese.reading);
          });
      });
        
      }, (e) => {
        console.log(e)
      });
    }
    return searchtag;
  }
}
