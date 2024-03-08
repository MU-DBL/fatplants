import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit {
  advancedSearchForm: FormGroup;
  searchForm: FormGroup;

  constructor(private router: Router, private formBuilder: FormBuilder) {}

  ngOnInit() {
    this.searchForm = this.formBuilder.group({
      species: ["arabidopsis", Validators.required],
      searchTerm: ["", Validators.required],
    });
    this.advancedSearchForm = this.formBuilder.group({
      species: ["arabidopsis", Validators.required],
      uniprotId: [""],
      tairId: [""],
    });
  }

  submitSearch() {
    const species = this.searchForm.get("species").value;
    const searchTerm = this.searchForm.get("searchTerm").value;

    console.log("Search Type and term", species, searchTerm);

    this.router.navigate(["/datasets/" + species], {
      queryParams: { searchTerm: searchTerm },
    });
  }

  openPopup() {
    this.advancedSearchForm.reset();
    document.getElementById('advancedSearchModal').classList.add('show');
  }

  closePopup() {
    document.getElementById('advancedSearchModal').classList.remove('show');
  }

  submitAdvancedSearch() {
    if (this.advancedSearchForm.valid) {
      const species = this.advancedSearchForm.get("species").value;
      const uniprotId = this.advancedSearchForm.get("uniprotId").value;
      const tairId = this.advancedSearchForm.get("tairId").value;

      console.log("Species:", species);
      console.log("Uniprot ID:", uniprotId);
      console.log("TAIR ID:", tairId);

      this.closePopup();

      this.router.navigate(["/datasets/" + species], {
        queryParams: { uniprotId: uniprotId, tairId: tairId },
      });
    } else {
      console.error("Form is invalid");
    }
  }
}