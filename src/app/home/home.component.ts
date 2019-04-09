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
    login as firebaseLogin
} from "nativescript-plugin-firebase"
import { DataEntity } from "../model/searchResponse.model";
import { searchResponseItemClient } from "../model/searchResponseItemClient";
import { VocabList } from "../model/vocabList.model";
import { map, filter } from "rxjs/operators";
import { ListPicker } from "tns-core-modules/ui/list-picker";
import { ItemEventData, ListView } from "tns-core-modules/ui/list-view/list-view";
import { ActivatedRoute, Router } from "@angular/router";
import { registerElement } from 'nativescript-angular/element-registry';
import { FilterSelect } from 'nativescript-filter-select';
import { setCssFileName } from "tns-core-modules/application/application";
import { Page } from "tns-core-modules/ui/page";
import { StackLayout } from "tns-core-modules/ui/layouts/stack-layout";

import { MainNavigation } from "../model/navigation/mainNavigation.model";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view";
import { alert } from "tns-core-modules/ui/dialogs";
import * as dialogs from "tns-core-modules/ui/dialogs";
import { ObservableArray } from "tns-core-modules/data/observable-array/observable-array";
import { test } from "../model/test.model";
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");
const frame = require('ui/frame');

setCssFileName("app.css");

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})

export class HomeComponent implements OnInit {


    public counter: number = 0;
    public username: string = "";
    public userEmail: string = "";
    public userEmail$: Observable<string>;
    public picked: string;
    public showlogin: boolean = true;
    loadingUser: boolean = true;
    user: User;
    users$: Observable<Array<User>>;
    responseItems$: Observable<Array<searchResponseItemClient>>;
    usersLists$: Observable<Array<VocabList>>;

    globalListChoice: string;
    globalListChoiceText: string;
    globalListChoiceId: string;

    public searchPhrase: string;
    postsObserver: Observable<any>;
    userVocabularyLists: Array<VocabList>;
    DisplaynoResultFound: boolean = false;
    showLoading: boolean = true;

    public tabSelectedIndex: number;
    public tabSelectedIndexResult: string;

    onSubmit = (args: any) => {

        let searchBar = <SearchBar>args.object;
        const rootFrame = frame.topmost().currentPage;
        const page = rootFrame.currentPage;

        // this.userService.search(searchBar.text, (result) => {
        //     this.responseItems$ = result;
        // });
        this.responseItems$ = this.userService.searchWord(searchBar.text);

    }
    currentroute: ActivatedRoute;
    selectedItem: number;
    public onTextChanged(args) {
        let searchBar = <SearchBar>args.object;
        console.log("SearchBar text changed! New value: " + searchBar.text);
    }

    public logoutNow(): void {
        console.log("logingout..");
        firebase.logout();
        this.userService.UserFromService = null;
        this.user = null;
    }

    public RegisterNow() {
        dialogs.login("Register to Goi", "EMail", "Password").then(r => {
            firebase.createUser({
                email: r.userName,
                password: r.password
            }).then(
                function (user) {
                    alert("Welcome " + user.email + "!");

                    const usersCollection = firebase2.firestore().collection("users");
                    const query = usersCollection
                        .where("uid", "==", user.uid);

                    query
                        .get()
                        .then(querySnapshot => {
                            if (querySnapshot.docs.length > 0) {
                                console.log('found someone!');
                                querySnapshot.forEach(doc => {
                                    console.log(`person found: ${doc.id} => ${JSON.stringify(doc.data().name)}`);
                                });
                            }
                            else {
                                console.log(querySnapshot);
                                console.log('nope no found ill insert this person..');
                                usersCollection.add(user);
                            }
                        });
                },
                function (errorMessage) {
                    alert(errorMessage);

                }
            );

        });
    }
    public LoginNow(): void {
        dialogs.login("Login to Goi", "Email", "Password").then(r => {
            firebase.login({
                type: firebase.LoginType.PASSWORD,
                passwordOptions: {
                    email: r.userName, // 'moses@gmail.com',
                    password: r.password // 'hejhej'
                }
            }).then(
                (result: firebaseUser) => {
                    JSON.stringify(result);

                    this.user = result as User;
                    this.userService.UserFromService = result;
                    this.user.points = 0;


                    const usersCollection = firebase2.firestore().collection("users");
                    const query = usersCollection
                        .where("uid", "==", this.user.uid);

                    query
                        .get()
                        .then(querySnapshot => {
                            if (querySnapshot.docs.length > 0) {
                                console.log('found someone!');
                                querySnapshot.forEach(doc => {
                                    console.log(`person found: ${doc.id} => ${JSON.stringify(doc.data().name)}`);
                                });
                            }
                            else {
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


        });


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
    constructor(private userService: UserService, private router: Router, private _page: Page,
        private currentRoute: ActivatedRoute) {
        // Use the component constructor to inject providers.
        // this.responseItems$ = of([]);
        this.router = router;
        this.currentroute = currentRoute;
        this.tabSelectedIndex = 0;
        this.tabSelectedIndexResult = "Profile Tab (tabSelectedIndex = 0 )";
        this.globalListChoiceText = (this.userService.getlistChoice() === undefined || this.userService.getlistChoice() == "" || this.userService.getlistChoice() == null) ? "Selected Vocabulary List" : 'Selected list: ' + this.userService.getlistChoice();
        let testlist = new Array<VocabList>(); 
        testlist.push(new VocabList("Loading","loading","loading",false));
        this.userVocabularyLists = testlist;
        this.getUser();
    }
    getUser(): void {
        if (this.userService.getUser() != null) {
            this.userService.getUser().subscribe((u) => {
                this.user = u;
                if(u != null)
                {
                    this.userVocabularyLists = this.userService.getListOfAllVocabList();
                    this.getSelectedItem();
                }
            });
        }
    }

    public pickerItems: ObservableArray<test>;

    
    ngOnInit(): void {
        this.globalListChoice = this.userService.getlistChoice();
        this.globalListChoiceId = this.userService.getlistChoiceId();
    }
    public getSelectedItem = (): void => {
        // return this.userVocabularyLists.find(v => v.listid == this.userService.getlistChoiceId());
    }

    public selectedIndexChanged(args) {
        let picker = <ListPicker>args.object;
        this.picked = this.usersLists$[picker.selectedIndex];
    }
    public onitemselected = (args: any) => {
        if (args.selected !== undefined)
            this.userService.setlistChoiceWithListId(args.selected);
    }
    public onPageLoaded(args: EventData): void {
        console.log("Page Loaded");
        const page = args.object as Page;
    }
    wordClick(args: ItemEventData) {

        const index = args.index;
        //https://github.com/NativeScript/nativescript-angular/issues/1320
        const listview = <ListView>args.object;
        args.view._context.selectedItem = (args.index);
        console.log('item..');
        listview.items[index].Selected = true;


        console.log(listview.items[index]);
        console.log(args);
        const pg = listview.page;
        console.log("page..?");
        console.log(pg);

        // WORKAROUND: the bug is that we have to manually refresh the listview on iOS
        listview.refresh();

        let list;
        const userObs = this.responseItems$.pipe();
        userObs.subscribe(val => {
            if (val.length > 0) {
                this.userService.insertIntoList(this.userService.getlistChoiceId(), val[args.index]);
            }
        });
    }
    wordClickSimple = (indexNum: number) => {
        const index = indexNum;
        let list;
        console.log("yeah here..");
        const userObs = this.responseItems$.pipe();
        userObs.subscribe(val => {
            if (val.length > 0) {
                console.log("go " + indexNum);
                this.userService.insertIntoList(this.userService.getlistChoiceId(), val[indexNum]);
            }
        });
    }

}
