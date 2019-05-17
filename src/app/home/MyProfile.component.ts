import { Component, OnInit, NgZone } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { UserService } from "../services/user.service";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { map } from 'rxjs/operators';

import {
    firestore
} from "nativescript-plugin-firebase"
import { VocabList } from "../model/vocabList.model";
import { Observable, from, of, BehaviorSubject } from "rxjs";
import { Answer } from "../model/Answer.model";
import { CompletedQuiz } from "../model/completedQuiz.model";
import { isLoadingProperty } from "tns-core-modules/ui/image/image";
const firebase2 = require("nativescript-plugin-firebase/app");


@Component({
    selector: "Myprofile",
    moduleId: module.id,
    templateUrl: "./MyProfile.component.html"
})
export class MyProfileComponent implements OnInit {

    private items: Array<CompletedQuiz> = [];
    public loading: boolean = true;

    public get Items(): Array<CompletedQuiz> {
        return this.items;
    }
    private getTime(date?: Date) {
        return date != null ? date.getTime() : 0;
    }
    get userCompleteSorted() {
        if (this.items !== undefined) {
            this.sortCompletedByDueDate();
            return this.items.reverse();
        }
    }
    public sortCompletedByDueDate(): void {
        if (this.items !== undefined) {
            this.items.sort((a: CompletedQuiz, b: CompletedQuiz) => {
                if (a.completedDate == null)
                    a.completedDate = new Date('1999-01-01');

                if (b.completedDate == null)
                    b.completedDate = new Date('1999-01-01');

                return this.getTime(a.completedDate) - this.getTime(b.completedDate);
            });
        }
    }


    constructor(private userService: UserService, private zone: NgZone) {
    }

    ngOnInit() {
        const colRef: firestore.CollectionReference = firebase2.firestore().collection("completedQuizzes").where("userId", "==", this.userService.UserFromService.uid)
        colRef.get().then(querySnapshot => {
            querySnapshot.forEach(doc => {
                this.items.push(new CompletedQuiz(doc.data().listId, doc.data().quizName, doc.data().completedDate, doc.data().completed, doc.data().userId, doc.data().correctWords, doc.data().mistakeWords));
            });
            this.loading = false;
        });
    }


}

