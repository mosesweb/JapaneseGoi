import { Component, OnInit } from "@angular/core";
import { RouterExtensions } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { UserService } from "../services/user.service";
import { SetupItemViewArgs } from "nativescript-angular/directives";
import { ItemEventData } from "tns-core-modules/ui/list-view";
import * as dialogs from "tns-core-modules/ui/dialogs";

import { 
    firestore} from "nativescript-plugin-firebase"
import { VocabList } from "../model/vocabList.model";
import { Observable, from, of } from "rxjs";
const firebase2 = require("nativescript-plugin-firebase/app");

@Component({
    selector: "Myprofile",
    moduleId: module.id,
    templateUrl: "./MyProfile.component.html"
})
export class MyProfileComponent implements OnInit {
    ngOnInit() {

    }
}