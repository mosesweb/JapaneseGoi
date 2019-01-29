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
    post: VocabList;
    currentQuestionIndex: number = 0;

    firstWord: ClientWord;

    constructor(private userService: UserService, private route : ActivatedRoute) {
    }

    getRandomOptions = () =>
    {
        const list = [];
        const list2 = [];

        this.post.words.forEach((val : ClientWord) =>
        {
                list.push(val.japanese_reading);
                list2.push(val.japanese_reading);
        });
        return list;
    }
    ngOnInit(): void {
          
        this.route.params.forEach(
            (params : Params) => {
                this.listid = params["listid"];
            }
         ); 
         
         this.postsObserver = this.userService.getVocabListById(this.listid);
         this.postsObserver
            .subscribe({
                next: post => {
                this.post = post;
                },
                error(error) { console.log(error); }, // optional
        });
        this.getFirstQuestion();  

    }

    getFirstQuestion = (): void =>
    {
        this.firstWord = this.post.words[0];
    }

    onTap(args: EventData) {
        let button = <Button>args.object;

        if(this.japaneseReadingIsCorrect(button.text))
            alert("correct");
        else
            alert("wrong");

        if(this.currentQuestionIndex < (this.post.words.length -1 ))
            this.currentQuestionIndex++;
    }

    japaneseReadingIsCorrect = (incomingJapaneseReadingGuess : string) => 
    {
        if(this.post.words[this.currentQuestionIndex].japanese_reading == incomingJapaneseReadingGuess)
            return true;
        return false;
    }
    shuffle(array) {
        var currentIndex = array.length, temporaryValue, randomIndex;
      
        // While there remain elements to shuffle...
        while (0 !== currentIndex) {
      
          // Pick a remaining element...
          randomIndex = Math.floor(Math.random() * currentIndex);
          currentIndex -= 1;
      
          // And swap it with the current element.
          temporaryValue = array[currentIndex];
          array[currentIndex] = array[randomIndex];
          array[randomIndex] = temporaryValue;
        }
      
        return array;
      }
}