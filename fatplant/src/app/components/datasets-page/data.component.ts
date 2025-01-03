import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from '../../services/api/api.service';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';
import { Soybean } from 'src/app/interfaces/Soybean';

@Component({
  selector: 'app-data',
  templateUrl: './data.component.html',
  styleUrls: ['./data.component.scss']
})
export class DataComponent implements OnInit {
  dataset: string = "";
  loading: boolean = false;//to enable or disable the progress bar, which already be removed because confliction with the paginator. -Sam
  arabidopsisDataSource: MatTableDataSource<any>;
  camelinaDataSource: MatTableDataSource<any>;
  soybeanDataSource: MatTableDataSource<any>;
  cupheaDataSource: MatTableDataSource<any>;
  pennycressDataSource: MatTableDataSource<any>;
  fattyAcidDataSource: MatTableDataSource<any>;
  showingSearch = false;
  currentPage = 1;
  searchQuery = "";
  resultsLength = 0;
  selectedFilterField = {
    name: "Gene Name",
    value: "gene_names"
  };

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private route: ActivatedRoute, private router: Router, private apiService: APIService) {
    this.route.paramMap.subscribe(params => {
      this.dataset = params.get('dataset');
    });
/*
    var localArabidopsisData: FatPlantDataSource = JSON.parse(localStorage.getItem('arabidopsis_data'));
    if (localArabidopsisData != null && (Date.now() - localArabidopsisData.retrievalDate <= globalRefreshTime)) {
      this.arabidopsisDataSource = new MatTableDataSource(localArabidopsisData.data);
    }
    else {
      this.loading = true;
      this.getArabidopsisData();
    }

    var localCamelinaData: FatPlantDataSource = JSON.parse(localStorage.getItem('camelina_data'));
    if (localCamelinaData != null && (Date.now() - localCamelinaData.retrievalDate <= globalRefreshTime)) {
      this.camelinaDataSource = new MatTableDataSource(localCamelinaData.data);
    }
    else {
      this.loading = true;
      this.getCamelinaData();
    }

    var localSoybeanData: FatPlantDataSource = JSON.parse(localStorage.getItem('soybean_data'));
    if (localSoybeanData != null && (Date.now() - localSoybeanData.retrievalDate <= globalRefreshTime)) {
      this.soybeanDataSource = new MatTableDataSource(localSoybeanData.data);
    }
    else {
      this.loading = true;
      this.getSoybeanData();
    }

    var localCupheaData: FatPlantDataSource = JSON.parse(localStorage.getItem('cuphea_data'));
    if (localCupheaData != null && (Date.now() - localCupheaData.retrievalDate <= globalRefreshTime)) {
      this.cupheaDataSource = new MatTableDataSource(localCupheaData.data);
    }
    else {
      this.loading = true;
      this.getCupheaData();
    }

    var localPennycressData: FatPlantDataSource = JSON.parse(localStorage.getItem('pennycress_data'));
    if (localPennycressData != null && (Date.now() - localPennycressData.retrievalDate <= globalRefreshTime)) {
      this.pennycressDataSource = new MatTableDataSource(localPennycressData.data);
    }
    else {
      this.loading = true;
      this.getPennycressData();
    }

    var localFattyAcidData: FatPlantDataSource = JSON.parse(localStorage.getItem('fattyacid_data'));
    if (localFattyAcidData != null && (Date.now() - localFattyAcidData.retrievalDate <= globalRefreshTime)) {
      this.fattyAcidDataSource = new MatTableDataSource(localFattyAcidData.data);
    }
    else {
      this.loading = true;
      this.getFattyAcidData();
    }
*/
  }

  get displayedColumns(): String[] {
    switch (this.dataset) {
      case "camelina":
        return ['camelina', 'refseq_id', 'protein_name', 'homeologs', 'cam_prot_entry'];
      case "soybean":
        return ['uniprot_id', 'refseq_id', 'glyma_id', 'gene_names', 'protein_name', 'soy_prot_entry'];
      case "cuphea":
        return ['protein_description', 'is_longest', 'cuphea_entry'];
      case "pennycress":
        return ['protein_description', 'is_longest', 'pennycress_entry'];
      case "fattyacid":
        return ['picture', 'lipidMapsID', 'name', 'mass', 'sofa_id', 'other_names', 'delta_notation'];
      default:
        return ['uniprot_id', 'refseq_id', 'tair_id', 'gene_names', 'protein_name', 'protein_entry'];
    }
  }

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
  onFieldChange(field) {
    this.selectedFilterField = field.value;
  }

  get currentDataSource(): MatTableDataSource<any> {
    switch (this.dataset) {
      case "camelina":
        return this.camelinaDataSource;
      case "soybean":
        return this.soybeanDataSource;
      case "cuphea":
        return this.cupheaDataSource;
      case "pennycress":
        return this.pennycressDataSource;
      case "fattyacid":
        return this.fattyAcidDataSource;
      default:
        return this.arabidopsisDataSource;
    }
  }
  changeDataset(newDataset: string) {
  
    this.router.navigate(["datasets/" + newDataset]);
    switch (newDataset) {
      case "arabidopsis":
        this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "lmpd").subscribe((data: any[]) => {
          this.arabidopsisDataSource = new MatTableDataSource(data);
          this.arabidopsisDataSource.paginator = this.paginator;
        }, error => {
          this.arabidopsisDataSource = new MatTableDataSource([]);
        });
        break;
      case "camelina":
        this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "camelina").subscribe((data: any[]) => {
          this.camelinaDataSource = new MatTableDataSource(data);
          this.camelinaDataSource.paginator = this.paginator;
        }, error => {
          this.camelinaDataSource = new MatTableDataSource([]);
        });
        break;
      case "soybean":
        this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "soya").subscribe((data: any[]) => {
          this.soybeanDataSource = new MatTableDataSource(data);
          this.soybeanDataSource.paginator = this.paginator;
        }, error => {
          this.soybeanDataSource = new MatTableDataSource([]);
        });
        break;
      case "cuphea":
        this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "cuphea").subscribe((data: any[]) => {
          this.cupheaDataSource = new MatTableDataSource(data);
          this.cupheaDataSource.paginator = this.paginator;
        }, error => {
          this.cupheaDataSource = new MatTableDataSource([]);
        });
        break;
      case "pennycress":
        this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "pennycress").subscribe((data: any[]) => {
          this.pennycressDataSource = new MatTableDataSource(data);
          this.pennycressDataSource.paginator = this.paginator;
        }, error => {
          this.pennycressDataSource = new MatTableDataSource([]);
        });
        break;
      case "fattyacid":
        this.apiService.searchFattyAcid(encodeURIComponent(this.searchQuery)).subscribe((data: any[]) => {
          this.fattyAcidDataSource = new MatTableDataSource(data);
          this.fattyAcidDataSource.paginator = this.paginator;
        }, error => {
          this.fattyAcidDataSource = new MatTableDataSource([]);
        });
        break;
    }
  }

  refreshData() {
    this.showingSearch = false;
    this.searchQuery = "";
    switch (this.dataset) {
      case "camelina":
        this.refreshCamelinaData();
      case "soybean":
        this.refreshSoybeanData();
      case "cuphea":
        this.refreshCupheaData();
      case "pennycress":
        this.refreshPennycressData();
      case "fattyacid":
        this.refreshFattyAcidData();
      default:
        this.refreshArapidopsisData();
    }
  }

  refreshArapidopsisData() {
    localStorage.removeItem('arabidopsis_data');
    this.arabidopsisDataSource = null;
    this.loading = true;
    this.getArabidopsisData();
  }

  refreshCamelinaData() {
    localStorage.removeItem('camelina_data');
    this.camelinaDataSource = null;
    this.loading = true;
    this.getCamelinaData();
  }

  refreshSoybeanData() {
    localStorage.removeItem('soybean_data');
    this.soybeanDataSource = null;
    this.loading = true;
    this.getSoybeanData();
  }

  refreshCupheaData() {
    localStorage.removeItem('cuphea_data');
    this.cupheaDataSource = null;
    this.loading = true;
    this.getCupheaData();
  }

  refreshPennycressData() {
    localStorage.removeItem('pennycress_data');
    this.pennycressDataSource = null;
    this.loading = true;
    this.getPennycressData();
  }

  refreshFattyAcidData() {
    localStorage.removeItem('fattyacid_data');
    this.fattyAcidDataSource = null;
    this.loading = true;
    this.getFattyAcidData();
  }

  getArabidopsisData() {
    this.apiService.getDataSetSamples("lmpd").subscribe((data: any[]) => {
      this.arabidopsisDataSource = new MatTableDataSource(data);
      let arabidopsisData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('arabidopsis_data', JSON.stringify(arabidopsisData));
      this.loading = false;
    });
  }
  getCamelinaData() {
    this.apiService.getDataSetSamples("camelina").subscribe((data: any[]) => {
      this.camelinaDataSource = new MatTableDataSource(data);

      let camelinaData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };

      camelinaData.data.forEach(e => {
        e.homeologs = e.cs_id.split(',');
        e.cs_id = e.homeologs.shift();
      })

      localStorage.setItem('camelina_data', JSON.stringify(camelinaData));
      this.loading = false;
    });
  }
  getSoybeanData() {
    this.apiService.getDataSetSamples("soya").subscribe((data: any[]) => {
      this.soybeanDataSource = new MatTableDataSource(data);
      let soybeanData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('soybean_data', JSON.stringify(soybeanData));
      this.loading = false;
    });
  }

  getCupheaData() {
    this.apiService.getDataSetSamples("cuphea").subscribe((data: any[]) => {
      this.cupheaDataSource = new MatTableDataSource(data);
      let cupheaData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('cuphea_data', JSON.stringify(cupheaData));
      this.loading = false;
    });
  }
  getPennycressData() {
    this.apiService.getDataSetSamples("pennycress").subscribe((data: any[]) => {
      this.pennycressDataSource = new MatTableDataSource(data);
      let pennycressData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('pennycress_data', JSON.stringify(pennycressData));
      this.loading = false;
    });
  }
  getFattyAcidData() {
    this.apiService.getDataSetSamples("fatty_acid").subscribe((data: any[]) => {
      this.fattyAcidDataSource = new MatTableDataSource(data);
      let fattyAcidData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('fattyacid_data', JSON.stringify(fattyAcidData));
      this.loading = false;
    });
  }
  convertSoybeanData(data: Soybean[]) {
    data.forEach(value => {
      if (value.RefSeq == "") value.RefSeqList = [];
      else {
        value.RefSeqList = value.RefSeq.split(";");
        value.RefSeqList.splice(-1, 1); // removes empty string from list
      }
    });
    return data;
  }
  uniqueTairs(tairIds) {
    return [...new Set(tairIds.map(id => { return id.split('.')[0] }))];
  }

  onSearchChange(query) {
    this.searchQuery = query.target.value;
  }

  applySearchQuery() {
    this.loading = true;
    this.showingSearch = true;
    if (this.dataset == "arabidopsis") {
      this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "lmpd").subscribe((data: any[]) => {
        this.arabidopsisDataSource = new MatTableDataSource(data);
        this.loading = false;
        this.currentDataSource.paginator = this.paginator;
      }, error => {
        this.arabidopsisDataSource = new MatTableDataSource([]);
        this.loading = false;
      });
    }
    else if (this.dataset == "camelina") {
      this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "camelina").subscribe((data: any[]) => {
        this.camelinaDataSource = new MatTableDataSource(data);
        this.loading = false;
        this.currentDataSource.paginator = this.paginator;
      }, error => {
        this.camelinaDataSource = new MatTableDataSource([]);
        this.loading = false;
      });
    }
    else if (this.dataset == "soybean") {
      this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "soya").subscribe((data: any[]) => {
        this.soybeanDataSource = new MatTableDataSource(data);
        this.loading = false;
        this.currentDataSource.paginator = this.paginator;
      }, error => {
        this.soybeanDataSource = new MatTableDataSource([]);
        this.loading = false;
      });
    }
    else if (this.dataset == "cuphea") {
      this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "cuphea").subscribe((data: any[]) => {
        this.cupheaDataSource = new MatTableDataSource(data);
        this.loading = false;
        this.currentDataSource.paginator = this.paginator;
      }, error => {
        this.cupheaDataSource = new MatTableDataSource([]);
        this.loading = false;
      });
    }
    else if (this.dataset == "pennycress") {
      this.apiService.searchSQLAPI(encodeURIComponent(this.searchQuery), "pennycress").subscribe((data: any[]) => {
        this.pennycressDataSource = new MatTableDataSource(data);
        console.log(this.pennycressDataSource);
        this.loading = false;
        this.currentDataSource.paginator = this.paginator;
      }, error => {
        this.pennycressDataSource = new MatTableDataSource([]);
        this.loading = false;
      });
    }
    else {
      this.apiService.searchFattyAcid(encodeURIComponent(this.searchQuery)).subscribe((data: any[]) => {
        this.fattyAcidDataSource = new MatTableDataSource(data);
        this.loading = false;
        this.currentDataSource.paginator = this.paginator;
      }, error => {
        this.fattyAcidDataSource = new MatTableDataSource([]);
        this.loading = false;
      });
    }
  }
}
