import { Component, ElementRef, ViewChild } from "@angular/core";
import { MobileService } from "./services/mobile/mobile.service";
import { AuthService } from "./services/auth.service";
import { MenuComponent } from "./components/homecomponents/menu/menu.component";

@Component({
  selector: "app-root",
  templateUrl: "./app.component.html",
  styleUrls: ["./app.component.css"],
})
export class AppComponent {
  // title = "fatplant";
  // scrollObserver: IntersectionObserver;
  // opaque: boolean = false;

  // @ViewChild("scrollMarker", {})
  // scrollMarker: ElementRef;

  // @ViewChild("menu", {})
  // menu: MenuComponent;

  // constructor(private mobileService: MobileService, public authService: AuthService) {}
  // ngAfterViewInit() {
  //   this.scrollObserver = new IntersectionObserver((entries) => {
  //     entries.forEach(entry => {
  //       if (entry.intersectionRatio <= 0) {
  //         this.header.setOpaque();
  //       }
  //       else {
  //         this.header.setTransparent();
  //       }
  //     });
  //   });
  //   this.scrollObserver.observe(this.scrollMarker.nativeElement);
  // }
}
