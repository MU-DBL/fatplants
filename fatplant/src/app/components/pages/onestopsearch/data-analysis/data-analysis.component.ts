import { Component, ElementRef, OnInit, ChangeDetectorRef, SystemJsNgModuleLoader, ViewChild } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { MatTabsModule } from '@angular/material/tabs';
import { Observable } from 'rxjs';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';
import jsPDF from 'jspdf';
import { ViewportScroller, Location } from '@angular/common';
import { Lmpd_Arapidopsis } from '../../../../interfaces/lmpd_Arapidopsis';
import { startWith, map, filter } from 'rxjs/operators';
import {Router, ActivatedRoute} from "@angular/router";
import {MatTableDataSource} from "@angular/material/table";
import {FatPlantDataSource} from "../../../../interfaces/FatPlantDataSource";
import { DataService } from 'src/app/services/data/data.service';
import { ShowresultsComponent } from '../showresults/showresults.component';

import { FirestoreAccessService } from 'src/app/services/firestore-access/firestore-access.service';
import { error } from '@angular/compiler/src/util';


@Component({
  selector: 'app-data-analysis',
  templateUrl: './data-analysis.component.html',
  styleUrls: ['./data-analysis.component.scss']
})
export class DataAnalysisComponent implements OnInit {
  @ViewChild('pdf') pdf: ElementRef;
  public items: Observable<unknown[]>;
  private itemCollection: AngularFirestoreCollection<any>;

  private lmpdCollection: AngularFirestoreCollection<Lmpd_Arapidopsis>;

  query: string = "Indole-3-glycerol-phosphate";
  tabIndex: number;
  uniprot: string = null;
  fp_id: string = null;
  searchError: boolean = false;
  isLoading: boolean;
  hasSearched: boolean = false;

  // when we search a gene name, we might get some other results
  // that match the query, this will store them so the user can select them
  relatedGeneNames = [];
  displayedGeneColumns = ["uniprot_id", "geneName", "proteinNames"]
  selectedGeneUniprot:string = "";
  selectedFPID:string = "";

  // these are the base details to pass to the display
  baseDetails: any = null;

  private imgUrl: SafeResourceUrl;
  private imgs = [];
  private noimg: boolean;
  private nopdb: boolean;
  proteindatabase: string = "Arabidopsis";

  Databases : any;

  proteinDatabase: Object; 
  species: string = 'lmpd';

  @ViewChild(ShowresultsComponent, {})
  private results: ShowresultsComponent;

  blastSelected: boolean = false;
  identifierControl = new FormControl(this.query);
  
  // filteredOptions: Observable<Lmpd_Arapidopsis[]>;
  loadingSearch = false;

  constructor(private http: HttpClient, private afs: AngularFirestore, private sanitizer: DomSanitizer, private viewportScroller: ViewportScroller, private router: Router,
     private route: ActivatedRoute, private dataService: DataService, private location: Location,
     private fsaccess: FirestoreAccessService,
     private detRef: ChangeDetectorRef) {

  }

  ngAfterViewInit() {
    
  }
  ngOnInit() {
    console.log("identifier control is : ",this.identifierControl);
    this.http.get('/static/json_config/Databases.json', {responseType: 'json'}).subscribe(data => 
    {
      this.Databases = data;
      console.log("the databases information is : ",this.Databases);
      this.proteinDatabase = this.Databases['Arabidopsis'];
      console.log("this protein Database : ", this.proteinDatabase);
      this.setDefaultSearch();
      this.route.params.subscribe(params => {
        if (params['uniprot_id'] != null) {
          this.uniprot = params['uniprot_id'];
          this.hasSearched = true;
          let field = this.proteinDatabase['query'][this.proteinDatabase['tabs'][this.proteinDatabase['tabIndex']]];
          console.log("field is :",field);
          if (!this.blastSelected) {
            this.fsaccess.getBaseProteinFromUniProt(this.query, this.proteinDatabase["fullSearchSpecies"]).subscribe((data: any) => {
              this.relatedGeneNames = data;
    
              this.validateResult(data[0]);
            });
          }
          else this.fsaccess.get(this.proteinDatabase['collection'], field, this.uniprot).subscribe((res : any) => {
            if (this.validateResult(res[0])) this.query = res[0].sequence;
            
  
          });
          setTimeout(() => {
            console.log('timeout');
          }, 3000);
        }
      });
    
    });
    this.isLoading = false;
  }


  OneClick() {
    console.log("entered the search");
    this.loadingSearch = true;

    if (this.proteindatabase === undefined) {
      this.proteindatabase = 'Arabidopsis';
    }
    // init
    this.hasSearched = true;
    this.uniprot = null;
    this.searchError = false;
    this.imgs = [];
    this.noimg = false;
    this.nopdb = false;
    this.dataService.BlastNeedUpdate = true;
    
    this.relatedGeneNames = [];

    if(this.blastSelected){
      this.fsaccess.get(this.proteinDatabase['collection'], 'sequence', this.query.toUpperCase(), 1).subscribe(res => {
        this.validateResult(res[0]);
      });
    }
    else{

      let field = this.proteinDatabase['query'][this.proteinDatabase['tabs'][this.proteinDatabase['tabIndex']]];

      // FULL SEARCH
      if (field == "fullSearch") {
        this.fsaccess.searchSQLAPI(this.query, this.proteinDatabase["fullSearchSpecies"]).subscribe((data: any) => {

          if (data.length > 10)
            this.relatedGeneNames = data.slice(0, 10);
          else
            this.relatedGeneNames = data;

          this.validateResult(data[0]);
        }, error => {
          this.searchError = true;
          this.loadingSearch = false;
        });
      }
      else if (field == "uniprot_id") {
        this.fsaccess.getBaseProteinFromUniProt(this.query, this.proteinDatabase["fullSearchSpecies"]).subscribe((data: any) => {
          this.relatedGeneNames = data;

          this.validateResult(data[0]);
        }, error => {
          this.searchError = true;
          this.loadingSearch = false;
        });
      }
      else {
        this.fsaccess.getBaseProteinFromTair(this.proteinDatabase["fullSearchSpecies"], this.query).subscribe((data: any) => {
          this.relatedGeneNames = data;

          this.validateResult(data[0]);
        }, error => {
          this.searchError = true;
          this.loadingSearch = false;
        });
      }
    }
  }

  validateResult(result: any): boolean {

    this.loadingSearch = false;
    this.baseDetails = [];
    this.uniprot = null;
    this.fp_id = null;
    this.detRef.detectChanges();

    if (result == undefined) {
      this.searchError = true;
      this.location.replaceState('one_click');
      this.detRef.detectChanges();
      return false;
    }
    else {

      if (!result.fp_id) {
        this.fsaccess.getBaseProteinFromUniProt(result.uniprot_id,this.proteinDatabase['fullSearchSpecies']).subscribe((data:any[]) => {
          if (data && data.length > 0) {
            this.uniprot = data[0].uniprot_id;
            this.location.replaceState('one_click/' + this.uniprot + "/summary");
            this.selectedGeneUniprot = this.uniprot;
            this.selectedFPID = data[0].fp_id;
            this.baseDetails = data[0];
            this.detRef.detectChanges();
            return true;
          }
        });
      }

      this.uniprot = result.uniprot_id;
      this.location.replaceState('one_click/' + this.uniprot + "/summary");
      this.selectedGeneUniprot = this.uniprot;
      this.selectedFPID = result.fp_id;
      this.baseDetails = result;
      this.detRef.detectChanges();
      return true;
    }
  }

  //loading progress
  Loading() {
    this.isLoading = true;
  }

  public downloadAsPDF() {
    const doc = new jsPDF();

    const specialElementHandlers = {
      '#editor': function (element, renderer) {
        return true;
      }
    };

    const pdfTable = this.pdf.nativeElement;

    doc.fromHTML(pdfTable.innerHTML, 15, 15, {
      width: 190,
      'elementHandlers': specialElementHandlers
    });

    doc.save('Data.pdf');
  }

  public clickScroll(elementId: string): void {
    console.log("scroll")
    this.viewportScroller.scrollToAnchor(elementId); //no use?
    let el = document.getElementById(elementId);
    el.scrollIntoView();
  }

  changeDatabase(database: string) {
    this.proteinDatabase = this.Databases[database];
    this.proteinDatabase['tabIndex'] = 0;
    this.query = "";
    this.species = this.proteinDatabase['fullSearchSpecies'];
    this.validateResult("");
    this.relatedGeneNames = [];
    return;
  }

  setDefaultSearch() {

    let field = this.proteinDatabase['query'][this.proteinDatabase['tabs'][this.proteinDatabase['tabIndex']]];
    let species = this.proteinDatabase['database'];

    if (species == "Arabidopsis") {
      if (field == "uniprot_id")
        this.query = "Q9SS98";

      else if (field == "tair_id")
        this.query = "AT3G01570";

      else
        this.query = "Indole-3-glycerol-phosphate";
      
    }
    else if (species == "Camelina") {
      if (field == "uniprot_id")
        this.query = "Q39026";

      else if (field == "tair_id")
        this.query = "AT2G43790";

      else
        this.query = "Mitogen-activated protein";
    }
    else {
      if (field == "uniprot_id")
        this.query = "I1JR35";
      else
        this.query = "Fucosyltransferase";
    }
    return this.query;
  }
}
