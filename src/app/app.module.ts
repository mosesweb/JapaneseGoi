import { NgModule, NO_ERRORS_SCHEMA, Injector } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from  '@angular/common/http';
import { AppComponent } from "./app.component";
import { UserService } from "./services/user.service";
import { NativescriptBottomNavigationModule} from "nativescript-bottom-navigation/angular";
import { mainMenuComponent } from "./menu/Mainmenu.component";
import { BrowserModule } from '@angular/platform-browser';

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        NativescriptBottomNavigationModule
    ],
    declarations: [
        AppComponent
    ],
    providers: [UserService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { 
    constructor(private injector: Injector) { }
}
