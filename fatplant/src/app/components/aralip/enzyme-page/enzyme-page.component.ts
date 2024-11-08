import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../../services/api/api.service';

@Component({
  selector: 'app-enzyme-page',
  templateUrl: './enzyme-page.component.html',
  styleUrls: ['./enzyme-page.component.scss']
})
export class EnzymePageComponent implements OnInit {
  arabidopsisDataSource: MatTableDataSource<any>;
  showingSearch = false;
  currentPage = 1;
  searchQuery = "";
  resultsLength = 0;
  selectedFilterField = {
    name: "Gene Name",
    value: "gene_names"
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.searchQuery = params['searchTerm'];
      if (this.searchQuery === undefined) {
        this.searchQuery = "";
      }
      console.log(this.searchQuery)
      this.applySearchQuery();
    });
  }

  onSearchChange(query) {
    this.searchQuery = query.target.value;
  }

  applySearchQuery() {
    this.showingSearch = true;
      this.apiService.searchEnzyme(encodeURIComponent(this.searchQuery)).subscribe((data: any[]) => {
        this.arabidopsisDataSource = new MatTableDataSource(data);
        this.arabidopsisDataSource.paginator = this.paginator;
      }, error => {
        this.arabidopsisDataSource = new MatTableDataSource([]);
      });
  }
}
