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
import { Observable, from, of } from "rxjs";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { NavigationExtras, Router, Params, ActivatedRoute } from "@angular/router";
import { ClientWord } from "../model/ClientWord.model";
import { Sense } from "../model/sense.model";
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");
const view = require("ui/core/view");

@Component({
    selector: "Singleword",
    moduleId: module.id,
    templateUrl: "./singleword.component.html"
})
export class SinglewordComponent implements OnInit {
    globalListChoice: string;
    globalListChoiceId: string = '';
    currentList: VocabList;
    wordsInList$: Observable<Array<ClientWord>>;
    vocablists: Array<VocabList>;
    vocablists$: Observable<Array<VocabList>>;
    listName$: Observable<string>;
    wordName$: Observable<ClientWord>;
    fakeArray = new Array(12);
    englishDefinitions$: Observable<Array<string>>;

    ngOnInit(): void {
        this.globalListChoice = this.userService.getlistChoice();
        this.globalListChoiceId = this.userService.getlistChoiceId();
        
        this.route.params.forEach(
            (params : Params) => {
                console.log("param id: " + params["listid"] + ' - ' + params["wordid"]);
                this.loadWord(null, params["listid"], params["wordid"]);
            }
         );        
    }

    loadWord = (user: User | null = null, listId: string, wordId: string) : void =>
    {
        const vocablistCollection = firebase2.firestore().collection("vocablists");
          const query = vocablistCollection
          .where("listId", "==", listId)
          
          query
          .get()
          .then(querySnapshot => {
                if(querySnapshot.docs[0] != null)
                {
                    // todo map this and print it nicely
                    if(querySnapshot.docs[0].data().words.filter(w => w.word_id == wordId).length > 0)
                    {
                        const dobj: any = querySnapshot.docs[0].data().words.filter(w => w.word_id == wordId)[0];
                        this.wordName$ = of(<ClientWord> {
                            english: dobj.english, 
                            japanese_reading: dobj.japanese_reading,
                            japanese_word: dobj.japanese_word,
                            all_variations: dobj.all_variations,
                            senses: dobj.senses
                         });
                         this.wordName$.subscribe(w => console.log(w.senses.length));
                         let list: Array<string> = [];
                         this.wordName$.subscribe(w => console.log(w.senses.forEach((x: Sense) => {
                            list.push(x.english_definitions.join(', '));
                        })));
                        list.shift();
                        this.englishDefinitions$ = of(list);

                    }
                }                    
            }
        );
    }

    constructor(private userService: UserService, private route : ActivatedRoute) {
    }
    
    
}

