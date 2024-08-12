import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {Observable} from "rxjs";
import {HttpClient} from '@angular/common/http';
import { Lmpd_Arapidopsis } from 'src/app/interfaces/lmpd_Arapidopsis';
import { APIService } from '../../services/api/api.service';

@Component({
  selector: 'app-glmol-structure-page',
  templateUrl: './glmol-structure-page.component.html',
  styleUrls: ['./glmol-structure-page.component.scss']
})
export class GlmolStructurePageComponent implements OnInit {

  @ViewChild('scroll') private myScrollContainer: ElementRef;
  
  pdbs = [];
  public items: Observable<Lmpd_Arapidopsis[]>;
  
  // nopdb means theres not a graph for a result
  // noRes means theres no result for a search
  nopdb: boolean = false;
  noRes: boolean = false;

  hasSearched = false;

  private glmolUrl: SafeResourceUrl;
  isGlmol: boolean;
  glmolID: string = "";
  searchQuery: string;
  displayedGeneColumns = ["uniprot_id", "geneName", "proteinNames"]

  relatedGeneNames = [];
  selectedFPID = "";
  selectedUniProt = "";
  loading = false;

  species = [
    {
      name: "Arabidopsis", 
      value: "lmpd"
    },
    {
      name: "Camelina", 
      value: "camelina"
    },
    {
      name: "Soybean", 
      value: "soya"
    }
  ];

  selectedSpecies = this.species[0].value;
  
  constructor(private sanitizer: DomSanitizer, 
    // private afs: AngularFirestore, 
    private http: HttpClient,
    private apiService: APIService) { }

  ngOnInit() {
  }

  Glmol() {
    this.loading = true;
    this.hasSearched = false;
    this.isGlmol = false; // hide iframe
    this.pdbs = [];
    this.nopdb = false;
    this.searchQuery = this.glmolID;
    this.relatedGeneNames = [];

    
    this.apiService.searchSQLAPI(this.glmolID, this.selectedSpecies).subscribe((data: any[]) => {

      if (data && data.length > 0) {
        if (data.length > 1) {
          this.relatedGeneNames = data.slice(0, 10);
        }

        this.noRes = false;
        this.selectedFPID = data[0].fp_id;
        this.selectedUniProt = data[0].uniprot_id;
        //this.SearchPDB(this.selectedUniProt);
        this.searchG2S(this.selectedUniProt);
        this.isGlmol = true; // show iframe
      }
      else {
        this.hasSearched = true;
        this.nopdb = true;
        this.noRes = true;
        this.loading = false;
      }
    }, error => {
      this.hasSearched = true;
      this.nopdb = true;
      this.noRes = true;
      this.loading = false;
    });
  }

  //load pdb url from alphafold -Sam
  searchG2S(pdb: string) {
    this.loading = true;
    this.http.get(`https://alphafold.ebi.ac.uk/api/prediction/${pdb}`).subscribe((result: any) => { 
      if (result != undefined && result.length >= 1) {
        let defaultPdb = this.SafeUrl(result[0].pdbUrl);
        this.pdbs.push({name:pdb,url:defaultPdb});
        this.nopdb = false;
      }
      this.nopdb = false;
      this.loading = false;
      this.hasSearched = true;
      if (this.pdbs.length === 0) {
        this.nopdb = true;
      }
      else {
        setTimeout(() => {
          this.scroll();
        }, 100);
      }
    }, error => {
      this.nopdb = true;
      this.loading = false;
    });
  }
  
  SafeUrl(input: string) {
    const tmpurl = '/static/viewer.html?' + input;
    console.log(tmpurl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(tmpurl);
  }

  //load firebase file name from local txt, obsolete
  SearchPDB(pdb: string) {
    this.http.get('/static/uniprot_pdb_list.txt', {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        if (line.slice(0, 6) === pdb) {
          let tmp = line.slice(0, -4);
          this.pdbs.push({name:tmp,url:this.SafeUrl(tmp)});
          if (tmp.slice(-7, -1) === 'defaul') {
            let swap = this.pdbs[0];
            this.pdbs[0] = {name:tmp,url:this.SafeUrl(tmp)};
            this.pdbs[this.pdbs.length - 1] = swap;
          }
        }
      }
      this.loading = false;
      this.hasSearched = true;
      if (this.pdbs.length === 0) {
        this.nopdb = true;
      }
      else {
        setTimeout(() => {
          this.scroll();
        }, 100);
      }
    });
  }
  setDefaultSearch() {
    this.glmolID = "P46086";
  }
  scroll(): void {
    try {
        this.myScrollContainer.nativeElement.scrollIntoView({
          behavior: "smooth"
        });
    } catch(err) { }                 
  }

  changeSpecies(e) {
    this.selectedSpecies = e.value;
  }

  selectColumn(uniprot_id: string, fp_id: string) {
    this.pdbs = [];
    this.nopdb = false;
    this.loading = true;
    this.hasSearched = false;
    this.selectedFPID = fp_id;
    this.selectedUniProt = uniprot_id;
    //this.SearchPDB(this.selectedUniProt);
    this.searchG2S(this.selectedUniProt);
    this.isGlmol = true; // show iframe
  }
}
