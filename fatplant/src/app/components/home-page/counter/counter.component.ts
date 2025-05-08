import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { Observable } from "rxjs";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  clientIp: string | null = null;
  randomNumber: number;
  count: string | null = "";

  constructor(
    private http: HttpClient,
    private router: Router
  ) { }

  ngOnInit(): void {
    this.getCount();
  }

  getCount(): void {
    this.http.get<{ ip: string }>('https://api.ipify.org/?format=json')
      .subscribe(response => {
        this.clientIp = response.ip;
        //console.log(this.clientIp)
        this.http.get<{ res: string }>(environment.BASE_API_URL + "visit/?info=" + this.clientIp)
          .subscribe(response => {
            //console.log(response)
            this.count = response.toString().padStart(6, '0');
          })
      }, error => {
        //console.error('Error fetching IP address:', error);
        this.clientIp = 'Unable to fetch IP address';
      });
  }

  navigateToAnalytics(): void {
    this.router.navigate(['/analytics']);
  }
}
