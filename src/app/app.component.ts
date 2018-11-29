import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";
const firebase = require("nativescript-plugin-firebase");

@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit { 
  constructor(private UserService: UserService)
  {
    firebase.init({
      onAuthStateChanged: function(data) { // optional but useful to immediately re-logon the user when he re-visits your app
        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
        if (data.loggedIn) {
          console.log("user's email address: " + (data.user.email ? data.user.email : "N/A"));
        }
      }
    })
  }
ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.

   
    }
}
