import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";
const firebaseAuth = require("nativescript-plugin-firebase");
import { registerElement } from 'nativescript-angular/element-registry';
import { FilterSelect } from 'nativescript-filter-select';

const firebase = require("nativescript-plugin-firebase");
const http = require('http');
const firebase2 = require("nativescript-plugin-firebase/app");
registerElement('FilterSelect', () => FilterSelect);


@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit { 
  constructor(private UserService: UserService)
  {
    
  }
ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // Subscribe to begin listening for async result
    firebase.init({
        onAuthStateChanged: (data)  => { // optional but useful to immediately re-logon the user when he re-visits your app
        console.log(data.loggedIn ? "Logged in to firebase" : "Logged out from firebase");
        if (data.loggedIn) {
            this.UserService.UserFromService = data.user;
            console.log(this.UserService.UserFromService.name + ' nice');
        }
        else
        {
            this.UserService.UserFromService = null;
            console.log('not logged in');
        }
        }
    });
   
    }
}
