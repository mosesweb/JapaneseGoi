import { NgModule, NO_ERRORS_SCHEMA, Injector } from "@angular/core";
import { NativeScriptModule } from "nativescript-angular/nativescript.module";

import { AppRoutingModule } from "./app-routing.module";
import { HttpClientModule } from  '@angular/common/http';
import { AppComponent } from "./app.component";
import { UserService } from "./services/user.service";
import { NativescriptBottomNavigationModule} from "nativescript-bottom-navigation/angular";
import { BrowserModule } from '@angular/platform-browser';
import { MyProfileComponent } from "./home/MyProfile.component";
import { mainmenuModule } from "./directives/mainmenu.module";

@NgModule({
    bootstrap: [
        AppComponent,
    ],
    imports: [
        NativeScriptModule,
        AppRoutingModule,
        HttpClientModule,
        NativescriptBottomNavigationModule,
        mainmenuModule
    ],
    declarations: [
        AppComponent,
        MyProfileComponent,
    ],
    providers: [UserService],
    schemas: [
        NO_ERRORS_SCHEMA
    ]
})
export class AppModule { 
    constructor(private injector: Injector) { }
}
