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
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");
const view = require("ui/core/view");

@Component({
    selector: "Singlelist",
    moduleId: module.id,
    templateUrl: "./singlelist.component.html"
})
export class SinglelistComponent implements OnInit {
    globalListChoice: string;
    globalListChoiceId: string = '';
    currentList: VocabList;
    wordsInList$: Observable<Array<ClientWord>>;
    vocablists: Array<VocabList>;
    vocablists$: Observable<Array<VocabList>>;
    listName$: Observable<string>;
    listId: string

    ngOnInit(): void {
        this.globalListChoice = this.userService.getlistChoice();
        this.globalListChoiceId = this.userService.getlistChoiceId();
        
        this.route.params.forEach(
            (params : Params) => {
                console.log("param id: " + params["id"]);
                this.loadLists(null, params["id"]);
                this.listId = params["id"];
            }
         );        
    }

    delete = () : void => 
    {
     console.log("going to delete: " + this.listId); 
     const vocablistCollection = firebase2.firestore().collection("vocablists");
     const query = vocablistCollection
     .where("listId", "==", this.listId);
     
     query
     .get()
     .then(querySnapshot => {
           if(querySnapshot.docs[0] != null)
           {
                console.log("deleting..." + querySnapshot.docs[0].data().title);
                const docid = querySnapshot.docs[0].id;
                vocablistCollection.doc(docid).delete();
           }
     });

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
                    this.listName$ = of('List: ' + querySnapshot.docs[0].data().title);
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

    constructor(private userService: UserService, private route : ActivatedRoute) {
    }
    
    getWordsInList(): void {

    }
    public viewMore = (args : any) : void => 
    {
    alert("hej");
    }
}

