import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { firestore } from "nativescript-plugin-firebase"

const firebase = require("nativescript-plugin-firebase");
const firebase2 = require("nativescript-plugin-firebase/app");
@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public counter: number = 0;
    public username : string = "";
    users$: Observable<Array<User>>;


    public logoutNow () : void
    {
        console.log("logingout..");    
        firebase.logout();
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
                console.log(errorMessage);
              }
          );
          console.log(this.users$);
    }

    onTap(args: EventData) {
        let button = <Button>args.object;
        console.log("trying..");
    
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

        //const firebase = require("nativescript-plugin-firebase")
        // Init your component properties here.
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
                console.log(errorMessage);
              }
          );
          const userDocument = firebase2.firestore().collection("users").doc("what");
          const usersCollection = firebase2.firestore().collection("users");

          userDocument.get().then(doc => {
            if (doc.exists) {
                console.log(`Document data: ${JSON.stringify(doc.data())}`);
            } else {
                console.log("No such document!");
            }
            });

            usersCollection.add({
                name: "Moses",
                email: "something@google.com",
                country: "Sweden",
              }).then(documentRef => {
                console.log(`Person added with auto-generated ID: ${documentRef.id}`);
              });
    }
}
