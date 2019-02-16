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
const firebase2 = require("nativescript-plugin-firebase/app");

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
        this.loadLists(this.userService.UserFromService);
        this.firestoreCollectionObservable();
    }
    onSetupItemView(args: SetupItemViewArgs) {
        // let indexOfCurrentSelected = this.vocablists.findIndex(v => v.title == this.userService.getlistChoice());
        // args.view.context.CurrentSelected = (args.index == indexOfCurrentSelected);
    }



    onTap(args: EventData) {
        
        dialogs.prompt({
            title: "New vocabulary list",
            message: "Create a brand new vocabulary list",
            cancelButtonText: "Cancel",
            defaultText: "List name",
            okButtonText: "Create",
            inputType: dialogs.inputType.text
        }).then(r => {
            if(r.result && r.text != "")
            {
                console.log("Result: " + r.result + ", text: " + r.text);
                let newList = new VocabList(r.text, this.userService.UserFromService.uid);
                this.userService.addVocabList(newList, this.userService.UserFromService.uid, (n) =>
                {
                    this.vocablists$.subscribe(o => o.push(n));
                });
            }
        });

     
    }

    loadLists = (user: User | null = null) : void =>
    {
        console.log("parameter " + user.uid);
        const vocablistCollection = firebase2.firestore().collection("vocablists");
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
        
    constructor(private userService: UserService) {
        this.vocablists = [];
        this.globalListChoice = this.userService.getlistChoice();
        this.globalListChoiceId = this.userService.getlistChoiceId();


    }
     onItemTap(args: ItemEventData) {
       
        
    }
    public viewMore = () : void => 
      {
      }
}

