import { Injectable } from '@angular/core';
import { Observable, of, from, pipe } from 'rxjs';
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
import { Guid } from '../model/Guid';
import { map, filter } from 'rxjs/operators';
import { ClientWord } from '../model/ClientWord.model';
import { Sense } from '../model/sense.model';
const firebase = require("nativescript-plugin-firebase");
const http = require('http');
const firebase2 = require("nativescript-plugin-firebase/app");


@Injectable()
export class UserService {
  public loggedIn: Boolean = false;
  public UserFromService : User
  getUser(): Observable<User> {
   
    const userdata = from(firebase.getCurrentUser());
    const example = userdata.pipe(map((val: User) => val));
    return example;
  }
  public globalListChoice: string;

  insertIntoList = (listId: string, word: searchResponseItemClient) : void =>
  {
    console.log("THIS IS THE THING");
    console.log(word);
    const vocablistCollection = firebase2.firestore().collection("vocablists");
    const query = vocablistCollection
    .where("listId", "==", listId);
    console.log('setted? ' + listId);
    
    let wordList :  Array<ClientWord> = [];
    wordList.push(<ClientWord>{
      japanese_reading: word.MainJapaneseReading,
      japanese_word: word.MainJapaneseWord
    });

    query
    .get()
    .then(querySnapshot => {
      querySnapshot.forEach(doc => {
        
        let wordList :  Array<ClientWord> = []; 

        if(doc.data().words !== undefined) 
        wordList = doc.data().words.map(w => <ClientWord> {
          japanese_reading: w.japanese_reading,
          japanese_word: w.japanese_word,
          english: w.senses[0] !== undefined ? w.senses[0].english_definitions.join(', ') : "",
          senses: w.senses !== undefined ? w.senses : null,
          all_variations: w.all_variations !== undefined ? w.all_variations : null,
          word_id: w.word_id
        });

         let senses: Sense[] = word.senses.map(s => <Sense> {
          english_definitions: s.english_definitions,
          parts_of_speech: s.parts_of_speech
        });

        let all_variations: Japanese[] = word.japanese.map(j => <Japanese> {
          japanese_word: j.word,
          japanese_reading: j.reading
        });

        wordList.push(<ClientWord>
        {
            japanese_reading: word.MainJapaneseReading, 
            japanese_word: word.MainJapaneseWord,
            english: word.senses[0].english_definitions.join(', '),
            senses: senses,
            all_variations: all_variations,
            word_id: Guid.newGuid()
        });
        
        vocablistCollection.doc(doc.id).set(
          {
            title: doc.data().title,
            listId: doc.data().listId,
            uid: doc.data().uid,
            words: wordList
          });
      });

    });
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

    if(listchoice.listid !== undefined && listchoice.listid != null)
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

    addVocabList = (vocablist: VocabList, uid: string, callback: (n: VocabList) => any): any => {
      const listsCollection = firebase2.firestore().collection("vocablists");
      console.log(Guid.newGuid);
      const guid = Guid.newGuid();
        listsCollection.add(
          {
            title: vocablist.title, 
            listId: guid, 
            uid: uid });
        
            let AddedVo = new VocabList(vocablist.title, uid, guid);

        callback(AddedVo);
    }
    clientItemsList: Array<searchResponseItemClient>

  constructor()
  {
    // Subscribe to begin listening for async result
    firebase.init({
      onAuthStateChanged: (data)  => { // optional but useful to immediately re-logon the user when he re-visits your app
        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
        if (data.loggedIn) {
          this.UserFromService = data.user;
          console.log(this.UserFromService.name + ' nice');
        }
        else
        {
          this.UserFromService = null;
          console.log('not logged in');
        }
      }
    });
    
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
                new VocabList(doc.data().title, "", doc.data().listId)
            );
        });
        callback(of(this.vocablists));
        });
    }
  search = (searchtag : string, callback: (n: Observable<Array<DataEntity>>) => any) : void => 
  {
    this.clientItemsList = [];
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
        clientItem.English = value.senses[0].english_definitions.join(', ');

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

  // return new observer holding the vocab lists!
  getAllVocabLists(token: string) {
    let posts: Array<VocabList> = [];
    return new Observable(observer => {
      const vocablistCollection = firebase2.firestore().collection("vocablists");
      const unsubscribe = vocablistCollection.onSnapshot(querySnapshot => {
        console.log(querySnapshot.docs[0].data().title);
         querySnapshot.docs.map(doc => 
          posts.push(<VocabList>
          {
            title: doc.data().title, 
            uid: doc.data().uid, 
            listid: doc.data().listId,
            words: doc.data().words !== undefined ? doc.data().words.map(w => <ClientWord> {
              japanese_reading: w.japanese_reading,
              japanese_word: w.japanese_word,
              senses: w.senses,
              all_variations: w.all_variations,
              english: w.english,
              word_id: w.word_id,
              listid: querySnapshot.docs[0].data().listId // could be done prettier..
          }) : []
          })
        );
  
          observer.next(posts);
  
      return () => {
        unsubscribe();
      }
    });
  });
}

 // return new observer holding the vocab lists!
 getVocabListById(listid: string) {
  let post: VocabList;
  return new Observable(observer => {
    const vocablistCollection = firebase2.firestore().collection("vocablists").where("listId", "==", listid);
    const unsubscribe = vocablistCollection.onSnapshot(querySnapshot => {
       querySnapshot.docs.map(doc => 
        post = <VocabList>
        {
          title: doc.data().title, 
          uid: doc.data().uid, 
          listid: doc.data().listId,
          words: doc.data().words !== undefined ? doc.data().words.map(w => <ClientWord> {
            japanese_reading: w.japanese_reading,
            japanese_word: w.japanese_word,
            senses: w.senses,
            all_variations: w.all_variations,
            english: w.english,
            word_id: w.word_id,
            listid: querySnapshot.docs[0].data().listId // could be done prettier..
        }) : []
        });

        observer.next(post);

    return () => {
      unsubscribe();
    }
  });
});
}
}


