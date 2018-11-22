import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
const firebase = require("nativescript-plugin-firebase");

@Component({
    selector: "Home",
    moduleId: module.id,
    templateUrl: "./home.component.html"
})
export class HomeComponent implements OnInit {
    public counter: number = 0;

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
                firebase.getCurrentUser()
                .then(user => console.log("User uid: " + user.uid))
                .catch(error => console.log("Trouble in paradise: " + error));
              },
              function (errorMessage) {
                console.log("Auth token retrieval error: " + errorMessage);
              }
          );
    }
    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
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
    }
}
