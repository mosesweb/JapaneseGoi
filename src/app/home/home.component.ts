import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";

import { 
    firestore, 
    User as firebaseUser, 
    login as firebaseLogin} from "nativescript-plugin-firebase"
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

    loadingUser: boolean = true;
    user: firebaseUser;
    users$: Observable<Array<User>>;


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
            // Optional 
            googleOptions: {
              hostedDomain: "org.nativescript.HelloWorld"
            }
          }).then(
              function (result) {
                JSON.stringify(result);
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
    constructor(private userService: UserService) {
        // Use the component constructor to inject providers.
    }
    ngOnInit(): void {
        this.users$ = this.userService.getAllUsers();
        this.userEmail$ = this.userService.getUserName();

        firebase.getCurrentUser()
        .then(user =>  this.user = user)
        .catch(error => console.log("Trouble in paradise: " + error));

        // Init your component properties here.
        firebase.init({
            onAuthStateChanged: (data) => { // optional but useful to immediately re-logon the user when he re-visits your app
                console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
                if (data.loggedIn) {
                    console.log(data);
                    this.user = data.user as firebaseUser;
                     
                }
            }
        });

        
    }

}
