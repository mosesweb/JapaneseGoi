import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";
const firebase = require("nativescript-plugin-firebase/app");
const firebaseAuth = require("nativescript-plugin-firebase");
import { registerElement } from 'nativescript-angular/element-registry';
import { FilterSelect } from 'nativescript-filter-select';

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

   
    }
}
