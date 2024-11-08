import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../services/api/api.service';

@Component({
  selector: 'app-aralip-menu',
  templateUrl: './aralip-menu.component.html',
  styleUrls: ['./aralip-menu.component.scss']
})
export class AralipMenuComponent implements OnInit {
  page: string = "";

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) {
    this.route.paramMap.subscribe(params => {
      this.page = params.get('page');
    });
  }

  ngOnInit(): void {
  }
  changePage(newPage: string) {
  
    console.log("aralip-menu/" + newPage);
    this.router.navigate(["aralip-menu/" + newPage]);
  }

}
