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
import { NavigationExtras, Router } from "@angular/router";
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");
const view = require("ui/core/view");

@Component({
    selector: "Mylist",
    moduleId: module.id,
    templateUrl: "./mylist.component.html"
})
export class MylistComponent implements OnInit {
    public counter: number = 0;
    public userEmail : string = "";

    loadingUser: boolean = true;
    CurrentUser: User;
    user: User;
    vocablists: Array<VocabList>;
    titleTextFieldText: any;
    _listTitle = "";
    userView = new Observable();
    globalListChoice: string;


    ngOnInit(): void {
        
        // Create an Observable out of a promise
        const userdata = from(firebase.getCurrentUser());
        
        const example = userdata.pipe(map((val: User) => this.user = val));
        const subscribe = example.subscribe((val: User) => this.loadLists(val));

        // Subscribe to begin listening for async result
        userdata.subscribe({
        next(response) { 
            console.log('below..');
            this.user = of(response); 
        },
        error(err) { console.error('Error: ' + err); },
        complete() { console.log('Completed'); }
        });
        
    }
    onSetupItemView(args: SetupItemViewArgs) {
        args.view.context.even = (args.index % 2 === 0);
        args.view.context.odd = (args.index % 2 !== 0);
        args.view.context.third = (args.index % 3 === 0);
        args.view.context.header = ((args.index + 1) % this.vocablists.length === 1);
        args.view.context.footer = (args.index + 1 === this.vocablists.length);
    }



    onTap(args: EventData) {
        let button = <Button>args.object;
        
        this.counter++;
        alert("Tapped " + this.counter + " times!");
        this.userService.addVocabList(this._listTitle, this.user.uid);
    }

    loadLists = (user: User) : void =>
    {
        const vocablistCollection = firebase2.firestore().collection("vocablists");
                    
        // "Gimme all lists from this user
        const query = vocablistCollection
        .where("uid", "==", user.uid);

        query
        .get()
        .then(querySnapshot => {
        querySnapshot.forEach(doc => {
            this.vocablists.push(
                new VocabList(doc.data().title, "")
            );
        });
        });

        console.log('thiis many ' + this.vocablists.length);
    }
        
    constructor(private userService: UserService) {
        this.vocablists = [];
        this.globalListChoice = this.userService.getlistChoice();

    }
     onItemTap(args: ItemEventData) {
        const index = args.index;
        if(this.vocablists.length > 0)
        {
            this.userService.setlistChoice(this.vocablists[args.index].title);
            this.globalListChoice = this.userService.getlistChoice();
        }
        else
            alert("cant add no items in list!");
    }
}

