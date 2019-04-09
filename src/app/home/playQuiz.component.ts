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
import { QuizWord } from "../model/QuizWord.model";
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
    QuizComplete: boolean = false;

    infoAboutPreviousEntry: string = 'Good luck!';
    firstWord: ClientWord;
    options: ClientWord[] = [];
    optionsPerQuestion: Array<QuizWord> = [];
    currentQuestionLevel: number = 0;
    statsText: string;
    
    numberofCorrect: number = 0;
    numberOfMistakes: number = 0;

    mistakeWords: Array<ClientWord> = [];
    correctWords: Array<ClientWord> = [];

    
    public get QuestionNumber() : string {
        return (this.currentQuestionIndex + 1).toString();
    }
    


    constructor(private userService: UserService, private route : ActivatedRoute) {
    }

    getRandomOptions = () =>
    {
        const list: Array<ClientWord> = [];
        const list2: Array<ClientWord> = [];
        let array = [];

        this.post.words.forEach((val : ClientWord) =>
        {
                let arrsize = (this.post.words.length / 4);

                list.push(val);
                list2.push(val);
        });
        return list;
        
    }
    getOptionsOne = ( words: ClientWord[] = this.options): Array<QuizWord>=>
    {
        let usedIndexes: number[] = [];
        let options: ClientWord[] = [];

        let totalwords: number = words.length;
        let questions: number = 4;
        let optionsSize: number = words.length / questions;
        
        let arrayOfArrays: Array<QuizWord> = [];
        
        for (let i= 0 ; i < words.length; i += optionsSize) {
           // arrayOfArrays.push(words.slice(i, i+optionsSize));
        }
        let list: Array<QuizWord> = words.map( 
            (a) => {
                return new QuizWord(
                    a.japanese_reading,
                    a.japanese_word,
                    a.english
                );
            }
            );
            list.forEach((q: QuizWord)  => {
                q.setOptions(words);
            });
        return list;
    }
    generateRandom (min : number, max : number, numbers : number[]) {
        let num = Math.floor(Math.random() * (max - min + 1)) + min;
        return (num === this.currentQuestionIndex || numbers.find(e => e == num)) ? 
        this.generateRandom(min, max, numbers) : num;

        // var test = generateRandom(1, 20)

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
                this.optionsPerQuestion = this.getOptionsOne(post.words);
                },
                error(error) { console.log(error); }, // optional
        });

    }
    retakeQuiz(args: EventData)
    {
        this.correctWords = [];
        this.mistakeWords = [];
        this.numberOfMistakes = 0;
        this.numberofCorrect = 0;
        this.currentQuestionIndex = 0;
        this.QuizComplete = false;
        this.infoAboutPreviousEntry = "Good luck!";
    }
    onTap(args: EventData) {
        let button = <Button>args.object;
        let item_contx: any = button.bindingContext;
        console.log("incoming guess");

        let quizWord: QuizWord = button.get("guess");
        

        if(this.japaneseReadingIsCorrect(quizWord))
        {
            this.infoAboutPreviousEntry = "Previous question: What is "+  this.post.words[this.currentQuestionIndex].english + " in Japanese? Your answer: " + button.text + ". It is correct!"
            this.userService.addAnswerEntry(this.post.words[this.currentQuestionIndex].english, button.text, true, this.listid);
            this.numberofCorrect++;
            this.correctWords.push(this.post.words[this.currentQuestionIndex]);
        }
        else
        {
            this.infoAboutPreviousEntry = "Previous question: What is "+  this.post.words[this.currentQuestionIndex].english + " in Japanese? Your answer: " + button.text + ". It is wrong!" + ' correct answer should have been: ' + this.post.words[this.currentQuestionIndex].japaneseFullReading 
            this.userService.addAnswerEntry(this.post.words[this.currentQuestionIndex].english, button.text, false, this.listid);
            this.numberOfMistakes++;
            this.mistakeWords.push(this.post.words[this.currentQuestionIndex]);
        }

        if(this.currentQuestionIndex < (this.post.words.length -1 ))
        {
            this.currentQuestionIndex++;
            this.currentQuestionLevel++;
            this.optionsPerQuestion = this.getOptionsOne(this.post.words);
        }
        else
        {
            this.QuizComplete = true;
            this.userService.addCompletedQuizEntry(this.listid, this.post.title, this.mistakeWords, this.correctWords);
            this.statsText = this.numberofCorrect + ' correct and ' + this.numberOfMistakes + ' mistakes out of ' + this.post.words.length;
        }
    }

    japaneseReadingIsCorrect = (incomingJapaneseReadingGuess : QuizWord) => 
    {
        if(this.post.words[this.currentQuestionIndex].japanese_reading == incomingJapaneseReadingGuess.japanese_reading
            || this.post.words[this.currentQuestionIndex].japanese_word == incomingJapaneseReadingGuess.japanese_word
            )
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