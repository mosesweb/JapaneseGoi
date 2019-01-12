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
import { searchResponse, DataEntity } from '../model/searchResponse.model';
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
  search = (searchtag : string, callback: (n: Observable<Array<DataEntity>>) => any) : void => 
  {
    if(searchtag != "")
    {
      getJSON("https://jisho.org/api/v1/search/words?keyword=" + searchtag).then((r: any) => 
      {
        
        let responseItems = searchResponseProxy.Create(r).data;
        console.log(responseItems.length);
        responseItems.forEach(function (searchResponse) {
          searchResponse.japanese.forEach(function(searchResponseJapanese) {
            console.log(searchResponseJapanese.word);
            console.log(searchResponseJapanese.reading);
          });
      });
        
      callback(of(responseItems));


      }, (e) => {
        console.log(e)
      });
    }
    return ;;
  }
}
