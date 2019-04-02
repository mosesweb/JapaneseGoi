import { NgModule, NO_ERRORS_SCHEMA } from "@angular/core";
import { mainMenuComponent } from "./menu/Mainmenu.component";
import { NativeScriptCommonModule } from "nativescript-angular/common";
import { HomeRoutingModule } from "../home/home-routing.module";
import { NativeScriptFormsModule } from "nativescript-angular/forms";
import { HomeModule } from "../home/home.module";

@NgModule({
    imports: [
        NativeScriptCommonModule,
        // HomeRoutingModule,
        NativeScriptFormsModule
    ],
    declarations: [
        mainMenuComponent
    ],
    exports: [mainMenuComponent],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class mainmenuModule {

 }
