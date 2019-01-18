import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule, RouterExtensions } from "nativescript-angular/router";
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
import { ClientWord } from "../model/ClientWord.model";
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
    vocablists$: Observable<Array<VocabList>>;
    globalListChoiceId: string = '';
;


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

        this.firestoreCollectionObservable();

        

    }
    onSetupItemView(args: SetupItemViewArgs) {
        let indexOfCurrentSelected = this.vocablists.findIndex(v => v.title == this.userService.getlistChoice());
        args.view.context.CurrentSelected = (args.index == indexOfCurrentSelected)
        // args.view.context.even = (args.index % 2 === 0);
        // args.view.context.odd = (args.index % 2 !== 0);
        // args.view.context.third = (args.index % 3 === 0);
        // args.view.context.header = ((args.index + 1) % this.vocablists.length === 1);
        // args.view.context.footer = (args.index + 1 === this.vocablists.length);

    }



    onTap(args: EventData) {
        let button = <Button>args.object;
        
        this.counter++;
        alert("Tapped " + this.counter + " times!");
        let newList = new VocabList(this._listTitle, this.user.uid);
        this.userService.addVocabList(newList, this.user.uid);

    }

    loadLists = (user: User | null = null) : void =>
    {
        const vocablistCollection = firebase2.firestore().collection("vocablists");
        const wordsCollection = firebase2.firestore().collection("wordsInList");
        // "Gimme all cities in California with a population below 550000"
          // "Gimme all lists from this user
          const query = vocablistCollection
          .where("uid", "==", user.uid);
          
          query
          .get()
          .then(querySnapshot => {
            console.log("go:)");
            // this.vocablists$ = of(( querySnapshot.docs.map(doc => new VocabList(doc.data().title, "", doc.data().listId))));
            this.vocablists$ = of(( querySnapshot.docs.map
                (
                    doc => 
                    <VocabList>
                    {
                    title: doc.data().title, 
                    uid: doc.data().uid, 
                    listid: doc.data().listId})));

                });

    }
    
    firestoreCollectionObservable(): void {
        this.vocablists$ = Observable.create(subscriber => {
          const colRef: firestore.CollectionReference = firebase2.firestore().collection("vocablists");

          colRef.onSnapshot((snapshot: firestore.QuerySnapshot) => {
              this.vocablists = [];
              snapshot.forEach(docSnap => 
                {
                    this.vocablists.push(new VocabList(docSnap.data().title, "", docSnap.data().listId));
                });
              subscriber.next(this.vocablists);
          });
        });
      }
        
    constructor(private userService: UserService,
        private routerExtensions: RouterExtensions) {
        this.vocablists = [];
        this.globalListChoice = this.userService.getlistChoice();
        this.globalListChoiceId = this.userService.getlistChoiceId();


    }
     onItemTap(args: ItemEventData) {
        const index = args.index;
        if(this.vocablists.length > 0)
        {
            args.view.backgroundColor = "green";
            const source = from(this.vocablists$);

            source.subscribe(val => 
                {
                    this.userService.setlistChoiceWithListId(val[args.index]);
                    this.globalListChoice = this.userService.getlistChoice();
                    this.globalListChoiceId = this.userService.getlistChoiceId();
                }
            )

        }
        
    }
    public viewMore = (args : any) : void => 
      {
      }
}

