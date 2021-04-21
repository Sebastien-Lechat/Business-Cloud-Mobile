import { Component } from '@angular/core';
import { ScreenOrientation } from '@ionic-native/screen-orientation/ngx';
@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent {
  constructor(private screenOrientation: ScreenOrientation) {
    if (typeof window.orientation !== 'undefined') { this.screenOrientation.lock(this.screenOrientation.ORIENTATIONS.PORTRAIT); }
  }
}
