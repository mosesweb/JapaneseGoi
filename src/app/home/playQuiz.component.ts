import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { fromObject, fromObjectRecursive, PropertyChangeData, EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { UserService } from "../services/user.service";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ChangeDetectionStrategy } from "@angular/core";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { TextField } from "tns-core-modules/ui/text-field";
import { map } from 'rxjs/operators';

import { 
    firestore, 
    User as firebaseUser, 
    login as firebaseLogin,
    UserMetadata} from "nativescript-plugin-firebase"
import { VocabList } from "../model/vocabList.model";
import { getViewById, View } from "tns-core-modules/ui/core/view/view";
import { Observable, from, of, Observer } from "rxjs";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { NavigationExtras, Router, Params, ActivatedRoute } from "@angular/router";
import { ClientWord } from "../model/ClientWord.model";
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");
const view = require("ui/core/view");

@Component({
    selector: "playQuiz",
    moduleId: module.id,
    templateUrl: "./playQuiz.component.html"
})
export class playQuizComponent implements OnInit {
    
    listid: string;
    vocabularyList: VocabList[];
    wordsInList$: Observable<Array<ClientWord>>;
    listName$: Observable<string>;
    postsObserver: Observable<any>;
    posts: VocabList[];

    firstWord: ClientWord;

    constructor(private userService: UserService, private route : ActivatedRoute) {
    }
    ngOnInit(): void {
          
        this.route.params.forEach(
            (params : Params) => {
                this.listid = params["listid"];
                this.loadLists(this.userService.UserFromService, this.listid);
            }
         ); 
         this.getFirstQuestion();  
         
         this.postsObserver = this.userService.getVocabListsByListId(this.listid);
         this.postsObserver
            .subscribe({
                next: posts => {
                this.posts = posts;
                },
                error(error) { console.log(error); }, // optional
        });
    }

    getFirstQuestion = (): void =>
    {
        // this.wordsInList$.subscribe(
        // list => this.firstWord = <ClientWord>{ english: list[0].english });
    }

  
    
    loadLists = (user: User | null = null, listId: string) : void =>
    {
        const vocablistCollection = firebase2.firestore().collection("vocablists");
          const query = vocablistCollection
          .where("listId", "==", listId);
          
          query
          .get()
          .then(querySnapshot => {
                if(querySnapshot.docs[0] != null)
                {
                    this.listName$ = of('Taking quiz: ' + querySnapshot.docs[0].data().title);
                    if(querySnapshot.docs[0].data().words.length > 0)
                    {
                        this.wordsInList$ = of(
                            querySnapshot.docs[0].data().words
                            .map(w => <ClientWord> {
                                japanese_reading: w.japanese_reading,
                                japanese_word: w.japanese_word,
                                senses: w.senses,
                                all_variations: w.all_variations,
                                english: w.english,
                                word_id: w.word_id,
                                listid: querySnapshot.docs[0].data().listId // could be done prettier..
                            })
                        );
                    }
                }
            }
        );
    }

}