import { Component, OnInit } from "@angular/core";

@Component({
    selector: "Home test",
    moduleId: module.id,
    templateUrl: "./home-test.component.html"
})
export class HomeTestComponent implements OnInit {
    public goToSomething = () => {
        // this.router.navigate(["/config"]);
        alert("lol");
      }

    constructor() {
        // Use the component constructor to inject providers.
    }

    ngOnInit(): void {
        // Init your component properties here.
    }
}
