import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "./home.component";
import { MylistComponent } from "./mylist.component";
import { SinglelistComponent } from "./singlelist.component";
import { SinglewordComponent } from "./singleword.component";


const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "mylists", component: MylistComponent },
    { path: "singlelist/:id", component: SinglelistComponent },
    { path: "singleword/:listid/:wordid", component: SinglewordComponent },

];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
