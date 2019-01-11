import { Component, OnInit } from "@angular/core";
import { NativeScriptRouterModule } from "nativescript-angular/router";
import { Button } from "tns-core-modules/ui/button";
import { EventData } from "tns-core-modules/data/observable";
import { User } from "../model/user.model";
import { Observable } from "rxjs";
import { UserService } from "../services/user.service";
import { getBoolean, setBoolean } from "tns-core-modules/application-settings";
import { SearchBar } from "tns-core-modules/ui/search-bar";
import { ChangeDetectionStrategy } from "@angular/core";
import { SetupItemViewArgs } from "nativescript-angular/directives";

import { 
    firestore, 
    User as firebaseUser, 
    login as firebaseLogin} from "nativescript-plugin-firebase"
const firebase = require("nativescript-plugin-firebase")
const firebase2 = require("nativescript-plugin-firebase/app");

class Country {
    constructor(public name: string) { }
}

let europianCountries = ["Austria", "Belgium", "Bulgaria", "Croatia", "Cyprus", "Czech Republic",
    "Denmark", "Estonia", "Finland", "France", "Germany", "Greece", "Hungary", "Ireland", "Italy",
    "Latvia", "Lithuania", "Luxembourg", "Malta", "Netherlands", "Poland", "Portugal", "Romania", "Slovakia",
    "Slovenia", "Spain", "Sweden", "United Kingdom"];

class Item {
    constructor(public name: string) { }
}

let items = ["ALL Heroes (header)", "Razor", "Rubick", "Phantom Lancer", "Legion Commander", "Brewmaster",
    "Outworld Devourer", "Sniper", "Lina", "Sven", "Visage", "Undying", "Tiny", "Tidehunter", "Puck", "Ursa",
    "Magnus", "Earthshaker", "Windrunner", "Techies", "Crystal Maiden", "Batrider", "Riki", "Invoker", "Venomancer",
    "Timbersaw", "Wraithking", "Anti Mage", "Ancient Apparition", "Troll Warlord", "Lich", "Enchantress",
    "Bristleback", "Pudge", "(footer)"];

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

    ngOnInit(): void {
        
        
    }

    public countries: Array<Country>;
    public dataItems: Array<Item>;

    constructor() {
        this.countries = [];

        for (let i = 0; i < europianCountries.length; i++) {
            this.countries.push(new Country(europianCountries[i]));
            if(i == 5)
            {
                this.countries[5].name = 'hello this is a long string because who the hell cares... aijdia\njsdijada';   
            }
        }

        this.dataItems = [];

        for (let i = 0; i < items.length; i++) {
            this.dataItems.push(new Item(items[i]));
        }
    }
    onSetupItemView(args: SetupItemViewArgs) {
        args.view.context.third = (args.index % 3 === 0);
        args.view.context.header = ((args.index + 1) % items.length === 1);
        args.view.context.footer = (args.index + 1 === items.length);
    }

    public onItemTap(args) {
        console.log("Item Tapped at cell index: " + args.index);
    }

}
