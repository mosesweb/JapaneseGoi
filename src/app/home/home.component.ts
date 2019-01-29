import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { Observable, of, from } from "rxjs";
import { UserService } from "../services/user.service";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";
import { SearchBar } from "tns-core-modules/ui/search-bar";

import { 
    firestore, 
    User as firebaseUser, 
    login as firebaseLogin} from "nativescript-plugin-firebase"
import { DataEntity } from "../model/searchResponse.model";
import { searchResponseItemClient } from "../model/searchResponseItemClient";
import { VocabList } from "../model/vocabList.model";
import { map, filter } from "rxjs/operators";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { ItemEventData } from "tns-core-modules/ui/list-view/list-view";
import { ActivatedRoute, Router } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { FilterSelect } from 'nativescript-filter-select';
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public counter: number = 0;
    public username : string = "";
    public userEmail : string = "";
    public userEmail$ : Observable<string>;
    public picked: string;
    public showlogin: boolean = true;
    loadingUser: boolean = true;
    user: User;
    users$: Observable<Array<User>>;
    responseItems$: Observable<Array<searchResponseItemClient>>;
    usersLists$: Observable<Array<VocabList>>;

    globalListChoice: string;
    globalListChoiceId: string;

    public searchPhrase: string;
    postsObserver: Observable<any>;
    userVocabularyLists: any;

    onSubmit = (args: any) =>  {
        let searchBar = <SearchBar>args.object;
        this.userService.search(searchBar.text, (result) => {
            this.responseItems$ = result;
        });
    }
    public onTextChanged(args) {
        let searchBar = <SearchBar>args.object;
        console.log("SearchBar text changed! New value: " + searchBar.text);
    }

    public logoutNow () : void
    {
        console.log("logingout..");    
        firebase.logout();
        this.user = null;
    }

    public LoginNow () : void 
    {
        firebase.login({
            type: firebase.LoginType.GOOGLE,
          }).then(
               (result : firebaseUser) => {
                JSON.stringify(result);
                
                this.user = result as User;
                this.user.points = 0;

                
                const usersCollection = firebase2.firestore().collection("users");
                const query = usersCollection
                .where("uid", "==", this.user.uid);
            
                query
                .get()
                .then(querySnapshot => {
                    if(querySnapshot.docs.length > 0)
                    {
                        console.log('found someone!');
                        querySnapshot.forEach(doc => {
                            console.log(`person found: ${doc.id} => ${JSON.stringify(doc.data().name)}`);
                        });
                        }
                    else
                    {
                        console.log(querySnapshot);
                    console.log('nope no found ill insert this person..');
                    usersCollection.add(this.user);
                    }
                  
                });
              },
              function (errorMessage) {
                console.log('NAH.. ' + errorMessage);
              }
          );
    }

    
    onTap(args: EventData) {
        let button = <Button>args.object;

        this.counter++;
        firebase.getAuthToken({
            // default false, not recommended to set to true by Firebase but exposed for {N} devs nonetheless :)
            forceRefresh: false
          }).then(
              function (token) {
                console.log("Auth token retrieved: " + token);
              },
              function (errorMessage) {
                console.log("Auth token retrieval error: " + errorMessage);
              }
          );
    }
    constructor(private userService: UserService, private router : Router) {
        // Use the component constructor to inject providers.
        this.responseItems$ = of([]);

    }
    getUser(): void {
        if(this.userService.getUser() != null)
        {
            this.userService.getUser().subscribe((u) => { 
                this.user = u;
            });
        }
      }

    ngOnInit(): void {

        this.users$ = this.userService.getAllUsers();
        this.userEmail$ = this.userService.getUserName();
        this.globalListChoice = this.userService.getlistChoice();
        this.globalListChoiceId = this.userService.getlistChoiceId();

        this.postsObserver = this.userService.getAllVocabLists("");
        this.postsObserver
           .subscribe({
               next: post => {
               this.userVocabularyLists = post;
               },
               error(error) { console.log(error); },
       });
       this.getSelectedItem();
       registerElement('FilterSelect', () => FilterSelect);

    }
    public getSelectedItem = (): void => 
    {
        // return this.userVocabularyLists.find(v => v.listid == this.userService.getlistChoiceId());
    }

    public selectedIndexChanged(args) {
        let picker = <ListPicker>args.object;
        this.picked = this.usersLists$[picker.selectedIndex];
    }
    public onitemselected = (args:any ) => {
        if(args.selected !== undefined)
        this.userService.setlistChoiceWithListId(args.selected);
    }
    wordClick(args: ItemEventData) {
        const index = args.index;
        let list;
        const userObs = this.responseItems$.pipe();
        userObs.subscribe(val => 
        {
            if(val.length > 0)
            {
                this.userService.insertIntoList(this.userService.getlistChoiceId(), val[args.index]);
            }
        });
    }
}
