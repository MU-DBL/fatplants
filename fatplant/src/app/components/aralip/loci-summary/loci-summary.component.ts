import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';
import { APIService } from '../../../services/api/api.service';

@Component({
  selector: 'app-loci-summary',
  templateUrl: './loci-summary.component.html',
  styleUrls: ['./loci-summary.component.scss'],
})
export class LociSummaryComponent implements OnInit {
  locationSummariesDataSource = new MatTableDataSource<any>(); // DataSource for the table
  searchQuery: string = ''; // Query for search

  @ViewChild(MatPaginator) paginator: MatPaginator; // Paginator reference

  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.loadLocationSummaries(); // Load data on component initialization
  }

  // Method to load data from API
  loadLocationSummaries(): void {
    this.apiService.get_location_summary().subscribe(
      (data: any[]) => {
        this.locationSummariesDataSource.data = data;
        this.locationSummariesDataSource.paginator = this.paginator;
        console.log(this.locationSummariesDataSource.data);
      },
      (error) => {
        console.error('Error fetching location summaries:', error);
        this.locationSummariesDataSource.data = []; // Clear data on error
      }
    );
  }

  // Handle search input change
  onSearchChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.searchQuery = inputElement.value;
    this.applySearchQuery(); // Apply the search on input change
  }

  // Apply search filter to the data source
  applySearchQuery(): void {
    this.locationSummariesDataSource.filter = this.searchQuery.trim().toLowerCase();
  }
}
