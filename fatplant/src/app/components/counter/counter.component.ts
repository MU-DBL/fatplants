import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Observable} from "rxjs";

@Component({
  selector: 'app-counter',
  templateUrl: './counter.component.html',
  styleUrls: ['./counter.component.scss']
})
export class CounterComponent implements OnInit {
  clientIp: string | null = null;
  randomNumber: number;
  count: string | null = "";
  private countRes = new Observable<string>();

  constructor(private http: HttpClient) { }

  ngOnInit(): void {
    this.getCount();
    
  }

  getCount(): void {
    this.http.get<{ ip: string }>('https://api.ipify.org/?format=json')
      .subscribe(response => {
        this.clientIp = response.ip;
        console.log(this.clientIp)
        /*
        this.countRes=this.http.get(environment.BASE_API_URL+"visit/?info="+this.clientIp, { responseType: 'text' });//.toString().padStart(6, '0');
        this.countRes.subscribe(res=>{
          console.log(res)
          this.count = res;
          console.log(this.clientIp)
        })
          */
        this.http.get<{ res: string }>(environment.BASE_API_URL+"visit/?info="+this.clientIp)
          .subscribe(response => {
            console.log(response)
            this.count = response.toString().padStart(6, '0');
          })
      }, error => {
        console.error('Error fetching IP address:', error);
        this.clientIp = 'Unable to fetch IP address';
      });
  }

  generateRandomNumber(): void {
    this.randomNumber = Math.floor(Math.random() * 100) + 1; // Generates a random number between 1 and 100
  }

}
