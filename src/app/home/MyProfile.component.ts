import { Component, OnInit, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { UserService } from "../services/user.service";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { 
    firestore} from "nativescript-plugin-firebase"
import { VocabList } from "../model/vocabList.model";
import { Observable, from, of } from "rxjs";
import { Answer } from "../model/Answer.model";
import { CompletedQuiz } from "../model/completedQuiz.model";
const firebase2 = require("nativescript-plugin-firebase/app");

@Component({
    selector: "Myprofile",
    moduleId: module.id,
    templateUrl: "./MyProfile.component.html"
})
export class MyProfileComponent implements OnInit {
    postsObserver: Observable<any>;
    postsCompletedObserver: Observable<any>;
    userAnswers: Array<Answer> = [];
    userCompleted: Array<CompletedQuiz> = [];

    

    public complets$: Observable<Array<CompletedQuiz>>;
    private complets: Array<CompletedQuiz> = [];


    public answers$: Observable<Array<Answer>>;
    private answers: Array<Answer> = [];


    private listenerUnsubscribe: () => void;



    get userCompleteSorted()  {
        if(this.userCompleted !== undefined)
        {
            this.sortCompletedByDueDate();
            return this.userCompleted.reverse();
        }
    }
    get userAmountofComplete()  {
        if(this.userCompleted !== undefined)
        {
            return this.userCompleted.length;
        }
    }
    get userAnswersSorted()  {
        if(this.userAnswers !== undefined)
        {
            this.sortByDueDate();
            return this.userAnswers.reverse();
        }
    }
    get getAmountofCorrect()  {
        if(this.userAnswers === undefined)
        return 0;

        return this.userAnswers.filter(a => a.correct == true).length;
    }
    get getAmountofWrong()  {
        if(this.userAnswers === undefined)
        return 0;
        
        return this.userAnswers.filter(a => a.correct == false).length;
    }
    private getTime(date?: Date) {
        return date != null ? date.getTime() : 0;
    }
    
    public sortByDueDate(): void {
        if(this.userAnswers !== undefined)
        {
            this.userAnswers.sort((a: Answer, b: Answer) => {
                if(a.answered == null)
                a.answered = new Date('1999-01-01');

                if(b.answered == null)
                b.answered = new Date('1999-01-01');

                return this.getTime(a.answered) - this.getTime(b.answered);
            });
        }
    }

    public sortCompletedByDueDate(): void {
        if(this.userCompleted !== undefined)
        {
            this.userCompleted.sort((a: CompletedQuiz, b: CompletedQuiz) => {
                if(a.completedDate == null)
                a.completedDate = new Date('1999-01-01');

                if(b.completedDate == null)
                b.completedDate = new Date('1999-01-01');

                return this.getTime(a.completedDate) - this.getTime(b.completedDate);
            });
        }
    }

    constructor(private userService: UserService, private zone: NgZone)
    {

    }

    ngOnInit() {
        this.postsObserver = this.userService.getAllAnswers("");
        this.postsObserver
           .subscribe({
               next: post => {
                    this.userAnswers = post;
               },
               error(error) { console.log(error); },
       });
       this.postsCompletedObserver = this.userService.getAllCompletedQuizzes("", this.userService.UserFromService);
       this.postsCompletedObserver
          .subscribe({
              next: post => {
                   this.userCompleted = post;
              },
              error(error) { console.log(error); },
      });
    }
    }

