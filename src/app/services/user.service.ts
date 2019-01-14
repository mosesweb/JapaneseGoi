import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { User } from '../model/user.model';
const appSettings = require("application-settings");
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
import { VocabList } from '../model/vocabList.model';
const firebase = require("nativescript-plugin-firebase");
const http = require('http');
const firebase2 = require("nativescript-plugin-firebase/app");

@Injectable()
export class UserService {
  public globalListChoice: string;

  insertIntoList = (listId: string, word: string) : void =>
  {
    
    const wordsCollection = firebase2.firestore().collection("wordsInList");
    wordsCollection.add({listId: listId, word: word});
    
  }
  setlistChoice = (listchoice : string) : void =>
  {
    appSettings.setString("listChoice", listchoice);
    const listChoice = appSettings.getString("listChoice", "");
    this.globalListChoice = listChoice;
  }
  setlistChoiceWithListId = (listchoice : VocabList) : void =>
  {
    if(listchoice.title !== undefined)
    appSettings.setString("listChoice", listchoice.title);

    if(listchoice.listid !== undefined)
    appSettings.setString("listChoiceId", listchoice.listid);

    const listChoice = appSettings.getString("listChoice", "");
    this.globalListChoice = listChoice;
  }
  getlistChoice = () : string =>
  {
    return appSettings.getString("listChoice", "");
  }
  getlistChoiceId = () : string =>
  {
    return appSettings.getString("listChoiceId", "");
  } 
    vocablists: Array<VocabList>;

    addVocabList = (vocablist: VocabList, uid: string): any => {
      const listsCollection = firebase2.firestore().collection("vocablists");
      listsCollection.add({title: vocablist.title, listId: vocablist.listid, uid: uid });
    }
    clientItemsList: Array<searchResponseItemClient>

  constructor()
  {

    
    this.clientItemsList = [];
    this.vocablists = [];
  }
  getAllUsers = (): Observable<Array<User>> => {
    return;
  };
  getUserName = () : Observable<string> => 
  {
    let auser;
    return;
  }
  getUserLists = (user: User, callback: (n: Observable<Array<VocabList>>) => any) : void =>
    {
      
        const vocablistCollection = firebase2.firestore().collection("vocablists");
            
        //"Gimme all lists from this user
        const query = vocablistCollection
        .where("uid", "==", user.uid);

        query
        .get()
        .then(querySnapshot => {


        querySnapshot.forEach(doc => {
            this.vocablists.push(
                new VocabList(doc.data().title, "")
            );
        });
        callback(of(this.vocablists));
        });
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
        
        clientItem.MainJapaneseWord = value.japanese[0].word;
        clientItem.MainJapaneseReading = value.japanese[0].reading;

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
