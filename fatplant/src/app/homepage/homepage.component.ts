import { Component, OnInit } from '@angular/core';
import {AuthService} from '../services/firestore-access/auth.service';
import {FirestoreConnectionService} from '../services/firestore-access/firestore-connection.service';
import {animate, style, transition, trigger} from '@angular/animations';
declare var require: any;
@Component({
  selector: 'app-homepage',
  templateUrl: './homepage.component.html',
  styleUrls: ['./homepage.component.scss'],
  animations: [
    trigger(
      'enterAnimation', [
        transition(':enter', [
          style({ transform: 'translateX(0)', opacity: 0 }),
          animate('500ms', style({ transform: 'translateX(0)', opacity: 1 }))
        ])
      ]
    )
  ],
})
export class HomepageComponent implements OnInit {
  MU = "/app/assets/homepageAssets/MU.png";
  WSU = '/app/assets/homepageAssets/WSU.png';
  NSF = '/app/assets/homepageAssets/NSF.png';
  PSC = '/app/assets/homepageAssets/PSC.png';
  USDA = '/app/assets/homepageAssets/usda.png';

  page1 = 'gone';
  page2 = 'active pages';
  page3 = 'inactive pages';
  page4 = 'inactive pages';

  pageDisplay = 'page2';
  pager = 2;
  user: any = {
    displayName: ''
  };
  newsPage = 1;
  more = false;

  newsItems: any[] = [];
  displayedItems: any[] = [];

  constructor(private authService: AuthService,
              private firestoreConnection: FirestoreConnectionService) { }

  ngOnInit() {
    this.authService.checkUser().subscribe(res => {
      if (res !== null) {
        this.authService.findUser(res.email).subscribe(ret => {
          this.user = ret.docs[0].data();
        });
      }
    });
    this.firestoreConnection.getNews().subscribe(res => {
      res.forEach(doc => {
        this.newsItems.push(doc.data());
      });
      this.newsItems = this.newsItems.sort((a: any, b: any) => {
        return a.timestamp.seconds - b.timestamp.seconds;
      });
      this.newsItems = this.newsItems.reverse();

      for(let i = 1; i < 4; i++) {
        if (i <= this.newsItems.length) {
          this.displayedItems.push(this.newsItems[i - 1]);
        }
      }
    });
    setInterval(() => {
      this.pager += 1;
      this.page(this.pager);
    }, 5000);
  }

  page(page) {
    this.pager = page;

    if (page > 4) {
      this.pager = 2;
      page = 2;
    }

    this.pageDisplay = 'page' + page;

    if (page === 2) {
      this.page2 = 'active pages';
      this.page3 = 'inactive pages';
      this.page4 = 'inactive pages';
    }
    if (page === 3) {
      this.page2 = 'inactive pages';
      this.page3 = 'active pages';
      this.page4 = 'inactive pages';
    }
    if (page === 4) {
      this.page2 = 'inactive pages';
      this.page3 = 'inactive pages';
      this.page4 = 'active pages';
    }

  }

  moreNews() {
    if (this.newsItems.length > 3 && (this.newsItems.length / 3) > this.newsPage) {
      this.more = true;
      this.displayedItems = [];
      for(let i = (3 * this.newsPage) + 1; i < (3 * this.newsPage) + 4; i++) {
        if (i <= this.newsItems.length) {
          this.displayedItems.push(this.newsItems[i - 1]);
        }
      }
      this.newsPage += 1;
    }
  }

  previousNews() {
    this.displayedItems = [];
    if (this.newsPage === 2) {
      this.newsPage -= 1;
      this.more = false;
      for(let i = 1; i < 4; i++) {
        this.displayedItems.push(this.newsItems[i - 1]);
      }
    } else {
      this.newsPage -= 2;
      for(let i = (3 * this.newsPage) + 1; i < (3 * this.newsPage) + 4; i++) {
        this.displayedItems.push(this.newsItems[i - 1]);
      }
      this.newsPage += 1;
    }
  }

}
