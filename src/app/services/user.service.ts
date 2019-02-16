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
import { map, filter, catchError } from 'rxjs/operators';
import { ClientWord } from '../model/ClientWord.model';
import { Sense } from '../model/sense.model';
import { HttpClient  } from '@angular/common/http';

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
        if(doc.data() !== undefined)
        {
        if(doc.data().words !== undefined) 
        wordList = doc.data().words.map(w => <ClientWord> {
          japanese_reading: w.japanese_reading,
          japanese_word: w.japanese_word,
          english: w.senses[0] !== undefined ? w.senses[0].english_definitions.join(', ') : "",
          senses: w.senses !== undefined ? w.senses : null,
          all_variations: w.all_variations !== undefined ? w.all_variations : null,
          word_id: w.word_id
        });
        let senses: Sense[];
        if(word.senses !== undefined)
          {
          senses = word.senses.map(s => <Sense> {
            english_definitions: s.english_definitions,
            parts_of_speech: s.parts_of_speech
          });
        }
        let all_variations: Japanese[];
        if(word.japanese !== undefined)
        {
           all_variations = word.japanese.map(j => <Japanese> {
            japanese_word: j.word,
            japanese_reading: j.reading
          });
        }
      

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
        }  
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
    if(listchoice == null)
    {
      console.log("set null on listchoice");
      appSettings.setString("listChoice", "");
      appSettings.setString("listChoiceId", "");
    }
    else
    {
      if(listchoice.title !== undefined)
      appSettings.setString("listChoice", listchoice.title);

      if(listchoice.listid !== undefined)
      appSettings.setString("listChoiceId", listchoice.listid);
    }
  
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

  constructor(private http: HttpClient)
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
  private handleError<T> (operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
   
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead
   
      // TODO: better job of transforming error for user consumption
      // this.log(`${operation} failed: ${error.message}`);
   
      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }

  searchWord = (searchtag: string): Observable<Array<searchResponseItemClient>> => 
  {
    return this.http.get<searchResponseProxy>("https://jisho.org/api/v1/search/words?keyword=" + searchtag)
      .pipe(
        map(result => 
          result.data.map(srpi => <searchResponseItemClient> { 
          MainJapaneseWord: srpi.japanese[0].word,
          MainJapaneseReading: srpi.japanese[0].reading,
          English: srpi.senses[0].english_definitions.join(', '),
          senses: srpi.senses !== undefined ? srpi.senses : null,
          japanese: srpi.japanese !== undefined ? srpi.japanese : null
        })),
        catchError(this.handleError('searchWord', []))
      );
  }

  // return all vocabulary lists
  getAllVocabLists(token: string) {
    let posts: Array<VocabList> = [];
    return new Observable(observer => {
      const vocablistCollection = firebase2.firestore().collection("vocablists");
      const unsubscribe = vocablistCollection.onSnapshot(querySnapshot => {
        if(querySnapshot.docs !== undefined)
        { 
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
        }
      return () => {
        unsubscribe();
      }
    });
  });
}

 // get one vocabulary list
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

 getWordById(wordId: string, listId: string) {
   console.log("got inside..");
   console.log("wid: " + wordId);
   console.log("lid: " + listId);
  let word: ClientWord = new ClientWord("");
  return new Observable(observer => {
    const vocablistCollection = firebase2.firestore().collection("vocablists").where("listId", "==", listId);


    const unsubscribe = vocablistCollection.onSnapshot(querySnapshot => {
      const dobj: any = querySnapshot.docs[0].data().words.filter(w => w.word_id == wordId)[0];
      if(dobj !== undefined)
      {
        word.english = dobj.english; 
        word.japanese_reading = dobj.japanese_reading;
        word.japanese_word = dobj.japanese_word;
        word.all_variations = dobj.all_variations;
        word.senses = dobj.senses;
      }
      else
        word.english = "DELETED WORD";

      observer.next(word);

    return () => {
      unsubscribe();
    }
  });
});
}
deleteWordById = (wordId: string, listId: string) => {
  console.log("got inside..");
  console.log("wid: " + wordId);
  console.log("lid: " + listId);
  const vocablistCollectionPure = firebase2.firestore().collection("vocablists");
   const vocablistCollection = firebase2.firestore().collection("vocablists").where("listId", "==", listId);
   vocablistCollection.onSnapshot(querySnapshot => {
      const docid = querySnapshot.docs[0].id;
      console.log(querySnapshot.docs[0].data().words.filter(w => w.word_id == wordId)[0]);
      vocablistCollectionPure.doc(docid).update({
      words: querySnapshot.docs[0].data().words.filter(w => w.word_id != wordId)
        // words: firebase2.firestore().FieldValue().arrayRemove(querySnapshot.docs[0].data().words.filter(w => w.word_id == wordId)[0])
      })
});
}
updateListNameById = (listId: string, listTitle: string) => {
  console.log("lid: " + listId);
  const vocablistCollectionPure = firebase2.firestore().collection("vocablists");
   const vocablistCollection = firebase2.firestore().collection("vocablists").where("listId", "==", listId);
   vocablistCollection.onSnapshot(querySnapshot => {
      const docid = querySnapshot.docs[0].id;
      if(listTitle != "" && listTitle != null)
      {
        vocablistCollectionPure.doc(docid).update({
        title: listTitle
          // words: firebase2.firestore().FieldValue().arrayRemove(querySnapshot.docs[0].data().words.filter(w => w.word_id == wordId)[0])
        })
      }
});
}
}


