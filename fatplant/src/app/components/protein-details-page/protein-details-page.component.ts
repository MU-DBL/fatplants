import { Component, OnInit, Input, ElementRef, ViewChild, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FunctionEntry } from 'src/app/interfaces/FunctionEntry';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { APIService } from '../../services/api/api.service';
import { GptDialogComponent } from 'src/app/components/commons/gpt-dialog/gpt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { DataService } from "../../services/blast_data/data.service";
import { Location } from '@angular/common';
import { MatStep } from '@angular/material/stepper';
import { HttpClient } from "@angular/common/http";
import { G2SEntry } from "../../interfaces/G2SEntry";
import { DomSanitizer } from "@angular/platform-browser";
import { toNumbers } from "@angular/compiler-cli/src/diagnostics/typescript_version";
import { StructureViewerComponent } from '../commons/structure-viewer/structure-viewer.component'
import { MatTabChangeEvent } from '@angular/material/tabs';
import { ClipboardService } from 'ngx-clipboard';
import { environment } from 'src/environments/environment';


@Component({
  selector: 'app-protein-details-page',
  templateUrl: './protein-details-page.component.html',
  styleUrls: ['./protein-details-page.component.scss']
})
export class ProteinDetailsPageComponent implements OnInit {

  uniprot_id: string;
  proteinDatabase: any;
  speciesName: string;
  baseDetails: any;
  extendedData: any;

  constructor(private route: ActivatedRoute,
    public dataService: DataService,
    private location: Location,
    private cdr: ChangeDetectorRef,
    public notificationService: NotificationService,
    public dialog: MatDialog, 
    private apiService: APIService,
    private http: HttpClient,
    private sanitizer: DomSanitizer,
    public clipboardService: ClipboardService, 
    private db: APIService) { }
  database: string;
  sequence:string;
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
  showPsiBlastTab:boolean;
  showAligmentsTab:boolean;
  showStructrueTab:boolean;
  showPathwayTab :boolean;
  showSummaryTab:boolean;
  showSimpleSummaryTab:boolean;
  percent: number;
  private intervalId: any;
  showProgress: boolean;
  pathwayList = [];
  noimg: boolean;
  pathwayLoading = false;
  leftArrowEnabled: boolean;
  rightArrowEnabled: boolean;
  showBlastResList = [];
  showPSIBlastResList = [];
  showFilterBlastResList = [];
  showFilterPSIBlastResList = [];
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
  headingName: String;
  BlastFilterValue:number;
  PSIBlastFilterValue:number;

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

    if(this.isCupheaPennycress(this.database)){
      this.showTabForCupheaPennycress(true)
      this.apiService.getExtendedDetails(this.uniprot_id, this.database.toLowerCase()).subscribe(res => {
        if (res && res[0]) {
          // console.log(res[0]);
          this.extendedData = res[0];
          this.sequence = this.extendedData.sequence;
          this.extendedData.staus = "unreviewed";
          this.headingName = this.extendedData.description;
          this.dataService.BlastNeedUpdate = true;
        }
      });
      return;
    }
    else
      this.showTabForCupheaPennycress(false);

      this.hasSearched = true;
      this.http.get('/static/json_config/Databases.json', { responseType: 'json' }).subscribe(data => {
        this.Databases = data;
        console.log("this is databases data : ",this.Databases['Arabidopsis']);
        this.proteinDatabase = this.Databases[this.database];

          this.speciesName = this.proteinDatabase['fullSearchSpecies'];
      
          console.log("this.database : ", this.database);
      
          this.apiService.getBaseProteinFromUniProt(this.uniprot_id, this.proteinDatabase["fullSearchSpecies"]).subscribe((data: any) => {
            
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

      if(this.isCupheaPennycress(this.database)){
        this.showTabForCupheaPennycress(true)
      }

      this.showTabForCupheaPennycress(false);

      this.hasSearched = true;
      this.http.get('/static/json_config/Databases.json', { responseType: 'json' }).subscribe(data => {
        this.Databases = data;

        this.proteinDatabase = this.Databases[this.database];

        this.speciesName = this.proteinDatabase['fullSearchSpecies']

        this.apiService.getBaseProteinFromUniProt(this.uniprot_id, this.proteinDatabase["fullSearchSpecies"]).subscribe((data: any) => {
          this.validateResult(data[0]);
          this.getExtendedSpecies();
        });
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
        this.cfg = this.isCupheaPennycress(this.database) ? "blast" : "alignments";
        break;
      case 2:
        this.cfg = this.isCupheaPennycress(this.database) ? "psi_blast" : "structure";
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
        this.apiService.getBaseProteinFromUniProt(result.uniprot_id, this.proteinDatabase['fullSearchSpecies']).subscribe((data: any[]) => {
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
    this.sequence = null;
    this.dataService.loading = true;
    console.log("result is : ", "nothing");
    console.log(this.baseDetails.fp_id);
    this.apiService.getExtendedDetails(this.baseDetails.fp_id, this.speciesName).subscribe(res => {
      this.SelectConfig();
      if (res && res[0]) {
  
        this.extendedData = res[0];
        this.splitGeneNames = this.extendedData.gene_names.split(' ');
        this.sequence = this.extendedData.sequence;
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
      this.apiService.searchSpeciesMapper("arabidopsis",encodeURIComponent(this.baseDetails.uniprot_id)).subscribe((data:any[]) => {
        if (data && data.length > 0) {
          this.homologs = data[0];
        }
      });
    }
    else if (this.speciesName == "camelina") {
      this.apiService.searchSpeciesMapper("camelina",encodeURIComponent(this.baseDetails.uniprot_id)).subscribe((data:any[]) => {
        if (data && data.length > 0) {
          this.homologs = data[0];
        }
      });
    }
    else if (this.speciesName == "soya") {
      this.apiService.searchSpeciesMapper("glymine_max",encodeURIComponent(this.baseDetails.uniprot_id)).subscribe((data:any[]) => {
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
          // console.log("this.database")
          //===============================================================================
          // this may acutally be fine and not need changes
          //===============================================================================
          
          if(this.isCupheaPennycress(this.database)){
            this.showBlastResList = [];
            this.apiService.getblast('arabidopsis', this.sequence, "").subscribe((res: any) => {
              this.SplitRes(res);
            });
            this.apiService.getblast('camelina', this.sequence, "").subscribe((res: any) => {
              this.SplitRes(res);
            });
            this.apiService.getblast('soybean', this.sequence, "").subscribe((res: any) => {
              this.SplitRes(res);
            });

            this.showProgress = false;
            this.dataService.updateBlastResult(this.showBlastResList)

          }else{
            this.showBlastResList = [];
            this.apiService.getblast(this.database.toLowerCase(), this.sequence, "").subscribe((res: any) => {
              this.SplitRes(res);
              this.showProgress = false;
              clearInterval(this.intervalId);
              this.dataService.updateBlastResult(res)
            });
          }
        }
        break; 
      case 'psi_blast':
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
          if(this.isCupheaPennycress(this.database)){
            this.showPSIBlastResList = [];
            this.apiService.getPSIBlast('arabidopsis', this.sequence, "").subscribe((res: any) => {
              this.SplitPSIBlastRes(res);
            });
            this.apiService.getPSIBlast('camelina', this.sequence, "").subscribe((res: any) => {
              this.SplitPSIBlastRes(res);
            });
            this.apiService.getPSIBlast('soybean', this.sequence, "").subscribe((res: any) => {
              this.SplitPSIBlastRes(res);
            });

            this.showProgress = false;
          }

        break;
      case 'pathway':
        this.pathwayList = [];
        this.noimg = false;
        this.pathwayLoading = true;
        this.apiService.getPathwaysByUniProt(this.speciesName, this.extendedData.uniprot_id).subscribe((data: any) => {
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
      const identities = this.extractPercentIdentities(tmp[i]);
      this.showBlastResList.push([tmp[i].split(/\r?\n/)[0], tmp[i], identities]);
    }

    this.showFilterBlastResList = this.showBlastResList;
    this.dataService.BlastNeedUpdate = false;
  }

  extractPercentIdentities(blastResult) {
    var regex = /Identities = \d+\/\d+ \((\d+)%\)/g;
    var matches;
    var lines = blastResult.split('\n');
    for (var i = 0; i < lines.length; i++) {
      var line = lines[i];
      matches = regex.exec(line);
      if(matches != null)
        break;
    }
    return matches == null ? null: matches[1];
  }

  SplitPSIBlastRes(result: string) {
    let tmp: any;
    tmp = result.split('>');
    tmp.shift();
    let index: number;

    if (!tmp[tmp.length - 1]) {
      this.showPSIBlastResList = [];
      return;
    }

    index = tmp[tmp.length - 1].search('Lambda');
    tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);

    for (var i in tmp) {
      const identities = this.extractPercentIdentities(tmp[i]);
      this.showPSIBlastResList.push([tmp[i].split(/\r?\n/)[0], tmp[i], identities]);
    }
    this.showFilterPSIBlastResList = this.showPSIBlastResList;
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
    this.selectedPathImage = environment.BASE_API_URL + "highlighted_image/?species=" + this.speciesName + "&uniprot_id=" + this.extendedData.uniprot_id + "&pathway_id=" + pathway;
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
    this.http.get(environment.BASE_API_URL + 'getcoordinates/?pathway_id=' + id, { responseType: 'text' }).subscribe(data => {
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
      img1.src = environment.BASE_API_URL + "highlighted_image/?species=" + this.speciesName + "&uniprot_id=" + this.uniprot_id + "&pathway_id=" + id;


    });
  }

  showViewer(pdbId: string, pdbLinkBase: string) {
    this.dialog.open(StructureViewerComponent, {
      width: '1000px',
      height: '700px',
      data: { pdbId: pdbId, pdbLinkBase: pdbLinkBase }
    });
  }

  showTabForCupheaPennycress(isCupheaPennycress: boolean){
    this.showAligmentsTab = !isCupheaPennycress;
    this.showStructrueTab = !isCupheaPennycress;
    this.showPathwayTab = !isCupheaPennycress;
    this.showSummaryTab = !isCupheaPennycress;
    this.showSimpleSummaryTab = isCupheaPennycress;
    this.showPsiBlastTab = isCupheaPennycress;
  }

  isCupheaPennycress(dataset:string){
    return (dataset === "Cuphea" || dataset === "Pennycress") ? true : false;
  }

  onBlastFilterValueChange(event: any) {
    var filterValue = parseFloat(event.value) || 0;
    this.showFilterBlastResList =  this.showBlastResList.filter(function(item) {
      return item[2] > filterValue;
    });
  }

  onPSIBlastFilterValueChange(event: any) {
    var filterValue = parseFloat(event.value) || 0;
    this.showFilterPSIBlastResList =  this.showPSIBlastResList.filter(function(item) {
      return item[2] > filterValue;
    });
  }
}
