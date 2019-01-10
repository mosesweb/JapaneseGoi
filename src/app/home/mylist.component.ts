import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";
import { SearchBar } from "tns-core-modules/ui/search-bar";

import { 
    firestore, 
    User as firebaseUser, 
    login as firebaseLogin} from "nativescript-plugin-firebase"
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");

@Component({
    selector: "Mylist",
    moduleId: module.id,
    templateUrl: "./mylist.component.html"
})
export class MylistComponent implements OnInit {
    public counter: number = 0;
    public username : string = "";
    public userEmail : string = "";
    public userEmail$ : Observable<string>;

    loadingUser: boolean = true;
    user: User;
    users$: Observable<Array<User>>;

    constructor(private userService: UserService) {
        // Use the component constructor to inject providers.
    }
    ngOnInit(): void {
        
        
    }

}
