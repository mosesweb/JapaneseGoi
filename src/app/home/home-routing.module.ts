import { NgModule } from "@angular/core";
import { Routes } from "@angular/router";
import { NativeScriptRouterModule } from "nativescript-angular/router";

import { HomeComponent } from "./home.component";
import { MylistComponent } from "./mylist.component";
import { SinglelistComponent } from "./singlelist.component";


const routes: Routes = [
    { path: "", component: HomeComponent },
    { path: "mylists", component: MylistComponent },
    { path: "singlelist/:id", component: SinglelistComponent },
];

@NgModule({
    imports: [NativeScriptRouterModule.forChild(routes)],
    exports: [NativeScriptRouterModule]
})
export class HomeRoutingModule { }
