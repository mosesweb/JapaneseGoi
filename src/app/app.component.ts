import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";
const firebaseAuth = require("nativescript-plugin-firebase");
import { registerElement } from 'nativescript-angular/element-registry';
import { FilterSelect } from 'nativescript-filter-select';
import * as firebase from "nativescript-plugin-firebase";
import { on as applicationOn, launchEvent, suspendEvent, resumeEvent, exitEvent, lowMemoryEvent, uncaughtErrorEvent, ApplicationEventData } from "tns-core-modules/application";

const http = require('http');
registerElement('FilterSelect', () => FilterSelect);


@Component({
    moduleId: module.id,
    selector: "ns-app",
    templateUrl: "app.component.html"
})
export class AppComponent implements OnInit { 

  shouldFireBaseInit: boolean = true;
  constructor(private UserService: UserService)
  {
    
  }
ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    // Subscribe to begin listening for async result
    
  
applicationOn(launchEvent, (args: ApplicationEventData) => {
  if (args.android) {
      // For Android applications, args.android is an android.content.Intent class.
      console.log("Launched Android application with the following intent: " + args.android + ".");
  } else if (args.ios !== undefined) {
      // For iOS applications, args.ios is NSDictionary (launchOptions).
      console.log("Launched iOS application with options: " + args.ios);
  }
});

applicationOn(suspendEvent, (args: ApplicationEventData) => {
  if (args.android) {
      // For Android applications, args.android is an android activity class.
      console.log("SUSPEND Activity: " + args.android);
  } else if (args.ios) {
      // For iOS applications, args.ios is UIApplication.
      console.log("UIApplication: " + args.ios);
  }
});

applicationOn(resumeEvent, (args: ApplicationEventData) => {
  if (args.android) {
      // For Android applications, args.android is an android activity class.
      console.log("RESUMEVENT Activity: " + args.android);
      this.shouldFireBaseInit = false;
  } else if (args.ios) {
      // For iOS applications, args.ios is UIApplication.
      console.log("UIApplication: " + args.ios);
  }
});
  if(this.shouldFireBaseInit)
  {
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
  
}
