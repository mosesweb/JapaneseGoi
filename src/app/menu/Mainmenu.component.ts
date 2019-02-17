import { Component, OnInit } from "@angular/core";
import { SelectedIndexChangedEventData } from "tns-core-modules/ui/tab-view/tab-view";
import { MainNavigation } from "../model/navigation/mainNavigation.model";
import { Router, ActivatedRoute } from "@angular/router";

@Component({
    selector: "Mainmenu",
    moduleId: module.id,
    templateUrl: "./Mainmenu.component.html"
})
export class mainMenuComponent implements OnInit {

    ngOnInit() {
    }

    public tabSelectedIndex: number;
    public tabSelectedIndexResult: string;
    currentroute: ActivatedRoute;

    constructor(private router : Router,
        private currentRoute: ActivatedRoute)
        {
            this.router = router;
            this.currentroute = currentRoute;
            this.tabSelectedIndex = 0;
            this.tabSelectedIndexResult = "Profile Tab (tabSelectedIndex = 0 )";
        }

    changeTab() {
        if (this.tabSelectedIndex === 0) {
            this.tabSelectedIndex = 1;
        } else if (this.tabSelectedIndex === 1) {
            this.tabSelectedIndex = 2;
        } else if (this.tabSelectedIndex === 2) {
            this.tabSelectedIndex = 0;
        }
    }

    onSelectedIndexChanged(args: SelectedIndexChangedEventData) {
        if (args.oldIndex !== -1) {
            const newIndex = args.newIndex;
            if (newIndex === MainNavigation.Home) {
                this.tabSelectedIndexResult = "Home Tab (tabSelectedIndex = 0 )";
                this.router.navigate([''], { relativeTo: this.currentRoute })
            } else if (newIndex === MainNavigation.MyLists) {
                this.tabSelectedIndexResult = "List Tab (tabSelectedIndex = 1 )";
                this.router.navigate(['mylists'], { relativeTo: this.currentRoute })
            } else if (newIndex === MainNavigation.Profile) {
                this.tabSelectedIndexResult = "Profile Tab (tabSelectedIndex = 2 )";
            }

        }
    }
}