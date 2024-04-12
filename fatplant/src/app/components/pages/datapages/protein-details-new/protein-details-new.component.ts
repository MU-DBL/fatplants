import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { FunctionEntry } from 'src/app/interfaces/FunctionEntry';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FirestoreAccessService } from 'src/app/services/firestore-access/firestore-access.service';
import { GptDialogComponent } from 'src/app/components/commons/gpt-dialog/gpt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from "../../../../services/data/data.service";
import { Location } from '@angular/common';
import { MatStep } from '@angular/material/stepper';
import { HttpClient } from "@angular/common/http";
import { G2SEntry } from "../../../../interfaces/G2SEntry";
import { DomSanitizer } from "@angular/platform-browser";
import { toNumbers } from "@angular/compiler-cli/src/diagnostics/typescript_version";
import { StructureViewerComponent } from '../../onestopsearch/structure-viewer/structure-viewer.component';
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ClipboardService } from 'ngx-clipboard';
import {MatButtonModule} from '@angular/material/button';

@Component({
  selector: 'app-protein-details-new',
  templateUrl: './protein-details-new.component.html',
  styleUrls: ['./protein-details-new.component.scss']
})
export class ProteinDetailsNewComponent implements OnInit {

  uniprot_id: string;
  proteinDatabase: any;
  speciesName: string;
  baseDetails: any;
  extendedData: any;

  constructor(private access: FirestoreAccessService,
    private afs: AngularFirestore,
    private route: ActivatedRoute,
    public dataService: DataService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    public notificationService: NotificationService,
    public dialog: MatDialog, private fsaccess: FirestoreAccessService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public clipboardService: ClipboardService) { }
  database: string;
  private cfg: string;
  translationObject;
  uniprotId;
  arapidopsisData: any;
  proteinData: any;
  proteinEntry;
  functions: FunctionEntry[];
  isLoadingArapidopsis = true;
  proteinDataSource: MatTableDataSource<FunctionEntry>;
  isLoadingProtein = true;
  isSummary: boolean;
  is3DStructure: boolean;
  isStructure: boolean;
  isBlast: boolean;
  isPathway: boolean;
  percent: number;
  private intervalId: any;
  showProgress: boolean;
  pathwayList = [];
  noimg: boolean;
  pathwayLoading = false;
  leftArrowEnabled: boolean;
  rightArrowEnabled: boolean;
  showBlastResList = [];
  loadedDatabase: any;
  selectedGPTQuery = "";
  splitGeneNames = [];
  homologs = null;
  noPdb: boolean;
  G2SDataSource: MatTableDataSource<G2SEntry>;
  defaultPdb: any;
  isLoadingImage: boolean;
  selectedPathImage = null;
  @ViewChild('canvasEl') canvasEl: ElementRef;
  context: CanvasRenderingContext2D;
  currPath: string;
  displayedColumns = ['entryId', 'gene', 'uniprotAccession', 'taxId', 'uniprotStart', 'uniprotEnd', '3DViewer'];
  Databases: any;
  query: string = "Fucosyltransferase";
  fp_id: string = null;
  searchError: boolean = false;
  loadingSearch = false;
  hasSearched: boolean = false;
  headingName: string = '';

  get g2sLoading(): boolean {
    return this.dataService.g2sLoading;
  }

  get prettyConfig(): string {
    if (this.cfg != undefined) return this.cfg[0].toUpperCase() + this.cfg.slice(1);
    else return "";
  }

  ngOnInit() {

    this.route.params.subscribe(params => {
      this.isSummary = false;
      this.is3DStructure = false;
      this.isStructure = false;
      this.isBlast = false;
      this.isPathway = false;

      if (this.uniprot_id == undefined) this.uniprot_id = params['uniprot_id'];
      if (this.cfg == undefined) this.cfg = "summary";
      this.database = params['database_name'];
    });
      this.hasSearched = true;
      this.http.get('/static/json_config/Databases.json', { responseType: 'json' }).subscribe(data => {
        this.Databases = data;
        console.log("this is databases data : ",this.Databases['Arabidopsis']);
        this.proteinDatabase = this.Databases[this.database];

          this.speciesName = this.proteinDatabase['fullSearchSpecies'];
      
          console.log("this.database : ", this.database);
      
          this.fsaccess.getBaseProteinFromUniProt(this.uniprot_id, this.proteinDatabase["fullSearchSpecies"]).subscribe((data: any) => {
            
            this.validateResult(data[0]);
            this.getExtendedSpecies();
            // this.getUniprotData();
          });
          // this.loadedDatabase = this.proteinDatabase['database'];

      });
    
  }

  ngOnChanges() {
    this.route.params.subscribe(params => {
      this.isSummary = false;
      this.is3DStructure = false;
      this.isStructure = false;
      this.isBlast = false;
      this.isPathway = false;

      if (this.uniprot_id == undefined) this.uniprot_id = params['uniprot_id'];
      if (this.cfg == undefined) this.cfg = "summary";
      this.database = params['database_name'];

      this.hasSearched = true;
      this.http.get('/static/json_config/Databases.json', { responseType: 'json' }).subscribe(data => {
        this.Databases = data;

        this.proteinDatabase = this.Databases[this.database];

        this.speciesName = this.proteinDatabase['fullSearchSpecies']

        this.fsaccess.getBaseProteinFromUniProt(this.uniprot_id, this.proteinDatabase["fullSearchSpecies"]).subscribe((data: any) => {
          this.validateResult(data[0]);
          this.getExtendedSpecies();
          // this.getUniprotData();
        });
        // this.loadedDatabase = this.proteinDatabase['database'];
      });
    });
  }

  copyToClipboard(sequence_data) {
    this.clipboardService.copyFromContent(sequence_data);
    this.notificationService.popup('Copied to Clipboard!');
  }
  tabChanged(event: MatTabChangeEvent): void {
    switch (this.cfg) {
      case 'summary':
        this.isSummary = false;
        break;
      case 'alignments':
        this.is3DStructure = false;
        break;
      case 'structure':
        this.isStructure = false;
        break;
      case 'blast':
        this.isBlast = false;
        break;
      default:
        this.isPathway = false;
        break;
    }

    switch (event.index) {
      case 0:
        this.cfg = "summary";
        break;
      case 1:
        this.cfg = "alignments";
        break;
      case 2:
        this.cfg = "structure";
        break;
      case 3:
        this.cfg = "blast";
        break;
      case 4:
        this.cfg = "pathway";
        break;
      default:
        this.cfg = "summary";
        break;
    }

    this.cdr.detectChanges();
    this.location.replaceState(`/details/${this.database}/` + this.uniprot_id + `/` + this.cfg);
    this.SelectConfig();

  }

  validateResult(result: any): boolean {

    console.log("result uniprot : ", result);
    this.loadingSearch = false;
    this.baseDetails = [];
    this.uniprot_id = null;
    this.fp_id = null;
    this.cdr.detectChanges();

    if (result == undefined) {
      this.searchError = true;
      this.location.replaceState(`details/${this.database}/`);
      this.cdr.detectChanges();
      return false;
    }
    else {
      console.log("validate result data : ", result);
      if (!result.fp_id) {
        this.fsaccess.getBaseProteinFromUniProt(result.uniprot_id, this.proteinDatabase['fullSearchSpecies']).subscribe((data: any[]) => {
          if (data && data.length > 0) {
            this.uniprot_id = data[0].uniprot_id;
            this.location.replaceState(`details/${this.database}/` + this.uniprot_id + `/summary`);
            this.baseDetails = data[0];
            this.cdr.detectChanges();
            return true;
          }
        });
      }

      this.uniprot_id = result.uniprot_id;
      this.location.replaceState(`details/${this.database}/` + this.uniprot_id + `/summary`);
      this.baseDetails = result;
      this.cdr.detectChanges();
      return true;
    }
  }


  getExtendedSpecies() {
    this.homologs = null;
    this.dataService.loading = true;
    console.log("result is : ", "nothing");
    this.fsaccess.getExtendedDetails(this.baseDetails.fp_id, this.speciesName).subscribe(res => {
      this.SelectConfig();
      if (res && res[0]) {
        
        this.extendedData = res[0];
        this.splitGeneNames = this.extendedData.gene_names.split(' ');
        this.selectedGPTQuery = this.splitGeneNames[0];
        if(this.database === "Arabidopsis") this.headingName = this.extendedData.protein_names
        else this.headingName = this.extendedData.protein_name;
        this.noPdb = false;
        this.dataService.loading = false;
        this.dataService.BlastNeedUpdate = true;
        this.noPdb = false;
        this.searchG2S();
      }
    });
    if (this.speciesName == "lmpd") {
      this.fsaccess.getMapForArabidopsis(this.baseDetails.uniprot_id).subscribe((data: any[]) => {
        if (data && data.length > 0) {
          this.homologs = data[0];
        }
      });
    }
    else if (this.speciesName == "camelina") {
      this.fsaccess.getMapForCamelina(this.baseDetails.uniprot_id).subscribe((data: any[]) => {
        if (data && data.length > 0) {
          this.homologs = data[0];
        }
      });
    }
    else if (this.speciesName == "soya") {
      this.fsaccess.getMapForSoybean(this.baseDetails.uniprot_id).subscribe((data: any[]) => {
        if (data && data.length > 0) {
          this.homologs = data[0];
        }
      });
    }
  }

  searchG2S() {
    this.dataService.g2sLoading = true;
    this.http.get(`https://alphafold.ebi.ac.uk/api/prediction/${this.uniprot_id}?key=AIzaSyCeurAJz7ZGjPQUtEaerUkBZ3TaBkXrY94`).subscribe((result: any) => {
      this.G2SDataSource = new MatTableDataSource(result);
      if (result != undefined && result.length >= 1) {
        this.defaultPdb = this.sanitizer.bypassSecurityTrustResourceUrl("/static/display3d.html?pdbId=" + result[0].pdbUrl);
        this.noPdb = false;
      }

      this.dataService.g2sLoading = false;
    }, error => {
      this.dataService.g2sLoading = false;
    });
  }

  openGptDialog() {
    const dialogRef = this.dialog.open(GptDialogComponent, {
      data: { identifier: this.selectedGPTQuery }
    });
  }

  getUniprotData() {
    if(this.database === "Arabidopsis"){
      this.afs.collection('/New_Lmpd_Arabidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
        this.arapidopsisData = res[0];
        console.log("arabidopsis data : ",this.arapidopsisData);
        if (this.arapidopsisData !== undefined) {
          this.arapidopsisData.gene_names = this.arapidopsisData.gene_names.replaceAll(' ', ', ');
          this.proteinEntry = this.arapidopsisData.protein_entry;
          this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
          
          this.access.getMapForArabidopsis(this.arapidopsisData.uniprot_id).subscribe(translation => {
            this.translationObject = translation;
          })
          
          this.getProteinEntry();
        }
        else {
          this.isLoadingProtein = false;
        }
        this.isLoadingArapidopsis = false;
      });

    }else if(this.database === "Camelina"){
      this.afs.collection('/New_Camelina', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
        this.arapidopsisData = res[0];
        console.log("arabidopsis data : ",this.arapidopsisData);
        if (this.arapidopsisData !== undefined) {
          this.proteinEntry = this.arapidopsisData.protein_entry;
          this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
          
          this.access.getMapForCamelina(this.arapidopsisData.uniprot_id).subscribe(translation => {
            this.translationObject = translation;
          })
          
          this.getProteinEntry();
        }
        else {
          this.isLoadingProtein = false;
        }
        this.isLoadingArapidopsis = false;
      });
    }else if(this.database === "Soybean"){
      this.afs.collection('/New_Soybean', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot_id)).valueChanges().subscribe((res: any) => {
        this.arapidopsisData = res[0];
        console.log("arabidopsis data : ", this.arapidopsisData);
        if (this.arapidopsisData !== undefined) {
          this.arapidopsisData.gene_names = this.arapidopsisData.gene_names.replaceAll(' ', ', ');
  
          this.access.getMapForSoybean(this.arapidopsisData.uniprot_id).subscribe(translation => {
            console.log("transaltion object : ", translation);
            this.translationObject = translation;
          })
  
          this.proteinEntry = this.arapidopsisData.protein_entry;
          this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
          this.getProteinEntry();
        }
        else {
          this.isLoadingProtein = false;
        }
        this.isLoadingArapidopsis = false;
      });
    }
    
  }
  getProteinEntry() {
    if(this.database === "Arabidopsis"){
      this.afs.collection('/New_Lmpd_Arabidopsis_Details', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
        this.proteinData = res[0];
        console.log("protein Data is : ",this.proteinData);
        if (this.proteinData === undefined) {
          this.afs.collection('/New_Lmpd_Arabidopsis_Details', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
            this.proteinData = res[0];
            this.isLoadingProtein = false;
          });
        }
        else {
          this.isLoadingProtein = false;
        }
        console.log("protein Data is : ",this.proteinData);
        this.splitGeneNames = this.proteinData.gene_names.split(' ');
        this.selectedGPTQuery = this.splitGeneNames[0];
      });
    }else if(this.database === "Camelina"){
      this.afs.collection('/New_Camelina_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
        this.proteinData = res[0];
        console.log("protein Data is : ",this.proteinData);
        if (this.proteinData === undefined) {
          this.afs.collection('/New_Camelina_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
            this.proteinData = res[0];
            this.proteinData.gene_names = this.proteinData.gene_names.replaceAll(' ', ', ');
  
            this.splitGeneNames = this.proteinData.gene_names.split(',');
  
            this.isLoadingProtein = false;
          });
        }
        else {
          this.splitGeneNames = this.proteinData.gene_names.split(' ');
          this.isLoadingProtein = false;
        }
  
        this.selectedGPTQuery = this.splitGeneNames[0];
      });
    }else if(this.database === "Soybean"){
      this.afs.collection('/New_Soybean_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot_id)).valueChanges().subscribe((res: any) => {
        this.proteinData = res[0];
        console.log("protein Data is : ",this.proteinData);
        if (this.proteinData === undefined) {
          this.afs.collection('/New_Soybean_Detail', ref => ref.limit(1).where('uniprot_id', '==', this.uniprot_id)).valueChanges().subscribe((res: any) => {
            this.proteinData = res[0];
            this.isLoadingProtein = false;
          });
        }
        else {
          this.isLoadingProtein = false;
        }
        console.log("protein Data is : ",this.proteinData);
        this.splitGeneNames = this.proteinData.gene_names.split(' ');
        this.selectedGPTQuery = this.splitGeneNames[0];
      });
    }
    
  }
  parseKeywords(originalKeywords) {
    let keywordList = originalKeywords.split(';');
    let output = "";
    keywordList.forEach((keyword, i, keywords) => {
      if (i === keywords.length - 1) {
        output += keyword;
      }
      else {
        output += keyword + ', ';
      }
    });
    return output;
  }
  getAlternativeNames(altNames) {
    let output = '';
    altNames.forEach((name, i, names) => {
      if (i === names.length - 1) {
        output += name;
      }
      else {
        output += name + ', ';
      }
    });
    return output;
  }

  selectGPTOption(selection) {
    this.selectedGPTQuery = selection.value;
  }


  changeConfig(newConfig: string) {
    newConfig = newConfig.toLowerCase();
    switch (this.cfg) {
      case 'summary':
        this.isSummary = false;
        break;
      case 'alignments':
        this.is3DStructure = false;
        break;
      case 'structure':
        this.isStructure = false;
        break;
      case 'blast':
        this.isBlast = false;
        break;
      default:
        this.isPathway = false;
        break;
    }
    this.cfg = newConfig;
    this.cdr.detectChanges();
    this.location.replaceState(`/details/${this.database}/` + this.uniprot_id + `/` + this.cfg);

    this.SelectConfig();
  }

  SelectConfig() {
    switch (this.cfg) {
      case 'summary':
        this.isSummary = true;
        break;
      case 'structure':
        this.isStructure = true;
        break;
      case 'alignments':
        this.is3DStructure = true;
        break;
      case 'blast':
        if (!this.dataService.BlastNeedUpdate && this.dataService.getBlastRes()) {
          this.SplitRes(this.dataService.getBlastRes());
          this.isBlast = true;
        }
        else {
          this.percent = 0;
          const getDownloadProgress = () => {
            if (this.percent <= 99) {
              this.percent = this.percent + 10;
            }
            else {
              clearInterval(this.intervalId);
            }
          };
          this.intervalId = setInterval(getDownloadProgress, 700);
          this.isBlast = true;
          this.showProgress = true;
          if (this.proteinDatabase === undefined) {
            // UPDATE THIS
            this.proteinDatabase = 'Arabidopsis';
          }

          //===============================================================================
          // this may acutally be fine and not need changes
          //===============================================================================

          this.dataService.updateBlastRes(this.proteinDatabase['database'], this.uniprot_id).subscribe(res => {
            this.SplitRes(res);
            this.showProgress = false;
            clearInterval(this.intervalId);

          });
        }

        break;
      case 'pathway':
        this.pathwayList = [];
        this.noimg = false;
        this.pathwayLoading = true;
        this.dataService.getPathwaysByUniProt(this.speciesName, this.extendedData.uniprot_id).subscribe((data: any) => {
          if (data && data.pathway_ids && data.pathway_ids.length > 0) {

            data.pathway_ids.forEach(id => {
              let slicedPathway = id.split(':');
              this.pathwayList.push(slicedPathway[1]);
            });

            this.noimg = false;
          }
          else {
            this.noimg = true;
          }
          this.pathwayLoading = false;
        }, err => {
          this.noimg = true;
          this.pathwayLoading = false;
        });
        // this.SearchPathway(this.uniprot_id);
        this.isPathway = true;
        break;
      default:
        break;
    }
    // update arrows
    switch (this.cfg) {
      case "summary":
        this.leftArrowEnabled = false;
        this.rightArrowEnabled = true;
        break;
      case "3DStructure":
        this.leftArrowEnabled = true;
        this.rightArrowEnabled = true;
      case "structure":
        this.leftArrowEnabled = true;
        this.rightArrowEnabled = true;
        break;
      case "blast":
        this.leftArrowEnabled = true;
        this.rightArrowEnabled = true;
        break;
      case "pathway":
        this.leftArrowEnabled = true;
        this.rightArrowEnabled = false;
        break;
      default:
        this.leftArrowEnabled = false;
        this.rightArrowEnabled = true;
        break;
    }
  }

  SplitRes(result: string) {
    this.showBlastResList = [];
    let tmp: any;
    tmp = result.split('>');
    tmp.shift();
    let index: number;

    if (!tmp[tmp.length - 1]) {
      this.dataService.BlastNeedUpdate = false;
      this.showBlastResList = [];
      return;
    }

    index = tmp[tmp.length - 1].search('Lambda');
    tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);


    for (var i in tmp) {
      this.showBlastResList.push([tmp[i].split(/\r?\n/)[0], tmp[i]])
    }

    this.dataService.BlastNeedUpdate = false;
  }

  arrowSelect(arrow: string, summaryStep: MatStep, structure3DStep: MatStep, structureStep: MatStep, blastStep: MatStep, pathwayStep: MatStep) { // arrow = "left" or "right" depending on what arrow was clicked
    if (arrow == "left") {
      switch (this.cfg) {
        case "summary":
          break;
        case "3DStructure":
          structure3DStep.select();
          break;
        case "structure":
          summaryStep.select();
          // this.changeConfig("summary");
          break;
        case "blast":
          structureStep.select();
          // this.changeConfig("structure");
          break;
        case "pathway":
          blastStep.select();
          // this.changeConfig("blast");
          break;
      }
    }
    else {
      switch (this.cfg) {
        case "summary":
          structureStep.select();
          // this.changeConfig("structure");
          break;
        case "3DStructure":
          structure3DStep.select();
          break;
        case "structure":
          blastStep.select();
          // this.changeConfig("blast");
          break;
        case "blast":
          pathwayStep.select();
          // this.changeConfig("pathway");
          break;
        case "pathway":
          break; // should not happen
      }
    }
  }

  selectImage(pathway: string) {
    this.isLoadingImage = true;
    this.selectedPathImage = "https://fatplantsmu.ddns.net:5000/highlighted_image/?species=" + this.speciesName + "&uniprot_id=" + this.extendedData.uniprot_id + "&pathway_id=" + pathway;
  }

  onImageLoad() {
    this.isLoadingImage = false;
  }

  loadImage(pathway) {
    //var id = selected[0]._value.slice(5);
    this.isLoadingImage = true;
    var id = pathway;


    //TODO
    //Clear canvas before load new image
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    var canvas = (this.canvasEl.nativeElement as HTMLCanvasElement);
    this.context.clearRect(0, 0, canvas.width, canvas.height);
    var elemLeft = canvas.offsetLeft + canvas.clientLeft;
    var elemTop = canvas.offsetTop + canvas.clientTop;
    var elements = [];
    //this.http.get('https://us-central1-linux-shell-test.cloudfunctions.net/keggget?cfg=get&para=conf&id='+id, {responseType: 'text'}).subscribe(data => {
    this.http.get('https://fatplantsmu.ddns.net:5000/getcoordinates/?pathway_id=' + id, { responseType: 'text' }).subscribe(data => {
      for (const line of data.substr(1).slice(0, -1).split('\\n')) {
        if (line.slice(0, 4) === 'rect') {
          var linesplit = line.split('\\t');
          var pos = linesplit[0];
          var url = linesplit[1];
          var possplit = pos.split(' ');
          var topleft = possplit[1];
          var bottomright = possplit[2];
          topleft = topleft.slice(1, -1);
          bottomright = bottomright.slice(1, -1);
          var top = toNumbers(topleft.split(',')[1])[0];
          var left = toNumbers(topleft.split(',')[0])[0];
          var bottom = toNumbers(bottomright.split(',')[1])[0];
          var right = toNumbers(bottomright.split(',')[0])[0];
          elements.push({
            colour: '#FFFFFF',
            width: right - left,
            height: bottom - top,
            top: top,
            left: left,
            url: url
          })

        }
      }
      canvas.addEventListener('click', function (event) {
        // var x = event.pageX - elemLeft;
        // var y = event.pageY - elemTop;
        var x = event.offsetX
        var y = event.offsetY
        // Collision detection between clicked offset and element.

        elements.forEach(function (element) {
          if (y > element.top && y < element.top + element.height
            && x > element.left && x < element.left + element.width) {
            //alert('clicked an element');
            window.open('http://www.kegg.jp' + element.url);

          }
        })
      }, false);

      canvas.addEventListener('mousemove', function (event) {
        var x = event.offsetX;
        var y = event.offsetY;
        var isIn = false;
        elements.forEach(function (element) {
          if (y > element.top && y < element.top + element.height
            && x > element.left && x < element.left + element.width) {
            isIn = true;
            canvas.style.cursor = "pointer";
          }
        })
        if (!isIn) {
          canvas.style.cursor = "default";
        }
      }, false);

      var ctx = this.context;
      elements.forEach(function (element) {
        ctx.fillStyle = element.colour;
        ctx.fillRect(element.left, element.top, element.width, element.height);
      });

      // var img1 = document.getElementById('pathway1') as HTMLImageElement;
      // ctx.drawImage(img1,0,0);
      var img1 = new Image();
      img1.onload = () => {
        this.isLoadingImage = false;
        ctx.canvas.height = img1.height;
        ctx.canvas.width = img1.width;
        ctx.drawImage(img1, 0, 0)
        // THESE LINES WOULD SCALE THE IMAGE DOWN
        // if so, set the max height/width in the html
        /* var scale = Math.min(canvas.width / img1.width, canvas.height / img1.height);
        // get the top left position of the image
        var x = (canvas.width / 2) - (img1.width / 2) * scale;
        var y = (canvas.height / 2) - (img1.height / 2) * scale;
        ctx.drawImage(img1, x, y, img1.width * scale, img1.height * scale);
        */

      }
      //img1.src = 'https://us-central1-linux-shell-test.cloudfunctions.net/keggget?cfg=get&para=image&id=' + id;
      img1.src = "https://fatplantsmu.ddns.net:5000/highlighted_image/?species=" + this.speciesName + "&uniprot_id=" + this.uniprot_id + "&pathway_id=" + id;


    });
  }

  showViewer(pdbId: string, pdbLinkBase: string) {
    this.dialog.open(StructureViewerComponent, {
      width: '1000px',
      height: '700px',
      data: { pdbId: pdbId, pdbLinkBase: pdbLinkBase }
    });
  }

  getDynamicFontSize(proteinName: string): string {
    if (proteinName.length < 50) {
      return '2rem';
    } else if (proteinName.length < 150) {
      return '1.5rem';
    } else {
      return '1.25rem';
    }
  }
}
