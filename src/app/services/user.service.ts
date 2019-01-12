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
import { searchResponse, DataEntity, JapaneseEntity } from '../model/searchResponse.model';
import { searchResponseProxy } from '../model/searchResponseProxy';
import { searchResponseItemClient } from '../model/searchResponseItemClient';
const firebase = require("nativescript-plugin-firebase");
const http = require('http');

@Injectable()
export class UserService {
  clientItemsList: Array<searchResponseItemClient>

  constructor()
  {
    this.clientItemsList = [];
  }
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
        
      responseItems.forEach((value: DataEntity) =>
      {
        let clientItem: searchResponseItemClient;
        let japanese_reading = "";
        let japanese_word = "";
        clientItem = value;
        clientItem.AllJapaneseReading = "testingtesting!!";
        value.japanese.forEach((japaneseEntity: JapaneseEntity) =>
        { 
          if(japaneseEntity.reading !== undefined && japaneseEntity.reading != null && japaneseEntity.reading != "")
          japanese_reading += japaneseEntity.reading + ', ';

          if(japaneseEntity.word !== undefined && japaneseEntity.word != null && japaneseEntity.word != "")
          japanese_word += japaneseEntity.word + ', ';
          
        })
        clientItem.AllJapaneseReading = japanese_reading;
        clientItem.AllJapaneseWord = japanese_word;

        this.clientItemsList.push(clientItem);
      })

      callback(of(this.clientItemsList));


      }, (e) => {
        console.log(e)
      });
    }
    return ;;
  }
}
