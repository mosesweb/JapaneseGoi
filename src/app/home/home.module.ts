import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { NativeScriptFormsModule } from "nativescript-angular/forms";

import { HomeRoutingModule } from "./home-routing.module";
import { HomeComponent } from "./home.component";
import { MylistComponent } from "./mylist.component";
import { SinglelistComponent } from "./singlelist.component";
import { SinglewordComponent } from "./singleword.component";
import { playQuizComponent } from "./playQuiz.component";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        HomeRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        HomeComponent,
        MylistComponent,
        SinglelistComponent,
        SinglewordComponent,
        playQuizComponent
    ],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class HomeModule {

 }
