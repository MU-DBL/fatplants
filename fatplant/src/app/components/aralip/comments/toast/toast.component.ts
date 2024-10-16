import { Component } from '@angular/core';

@Component({
  selector: 'app-toast',
  templateUrl: './toast.component.html',
  styleUrls: ['./toast.component.css']
})
export class ToastComponent {
  /*isVisible = false;
  message = 'Form submitted successfully!';

  //Show toast for a few seconds
  show(message: string = 'Form submitted successfully!') {
    this.message = message;
    this.isVisible = true;
    setTimeout(() => {
      this.isVisible = false;
    }, 3000);  / Auto-hide after 3 seconds
  }*/
}
