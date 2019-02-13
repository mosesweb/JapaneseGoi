import { Component, OnInit } from "@angular/core";
import { UserService } from "./services/user.service";
const firebaseAuth = require("nativescript-plugin-firebase");
import { registerElement } from 'nativescript-angular/element-registry';
import { FilterSelect } from 'nativescript-filter-select';
import * as firebase from "nativescript-plugin-firebase";

const http = require('http');
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
    
   
    }
}
