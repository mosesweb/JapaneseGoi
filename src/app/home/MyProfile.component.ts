import { Component, OnInit } from "@angular/core";
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
const firebase2 = require("nativescript-plugin-firebase/app");

@Component({
    selector: "Myprofile",
    moduleId: module.id,
    templateUrl: "./MyProfile.component.html"
})
export class MyProfileComponent implements OnInit {
    postsObserver: Observable<any>;
    userAnswers: Array<Answer>;


    get userAnswersSorted()  {
        this.sortByDueDate();
       return this.userAnswers.reverse();
    }
    get getAmountofCorrect()  {
        return this.userAnswers.filter(a => a.correct == true).length;
    }
    get getAmountofWrong()  {
        return this.userAnswers.filter(a => a.correct == false).length;

    }
    private getTime(date?: Date) {
        return date != null ? date.getTime() : 0;
    }
    
    public sortByDueDate(): void {
        this.userAnswers.sort((a: Answer, b: Answer) => {
            if(a.answered == null)
            a.answered = new Date('1999-01-01');

            if(b.answered == null)
            b.answered = new Date('1999-01-01');

            return this.getTime(a.answered) - this.getTime(b.answered);
        });
    }

    constructor(private userService: UserService)
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
    }
}