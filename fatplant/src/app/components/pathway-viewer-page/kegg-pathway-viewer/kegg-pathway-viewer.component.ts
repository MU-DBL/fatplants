import { Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import { DomSanitizer, SafeResourceUrl, SafeUrl} from '@angular/platform-browser';
import {HttpClient} from '@angular/common/http';
import { Lmpd_Arapidopsis } from 'src/app/interfaces/lmpd_Arapidopsis';
import { Observable } from 'rxjs';
// import { AngularFirestore } from 'angularfire2/firestore';
import {toNumbers} from "@angular/compiler-cli/src/diagnostics/typescript_version";
import { FirestoreAccessService } from 'src/app/services/firestore-access/firestore-access.service';
import { environment } from 'src/environments/environment';
import { APIService } from 'src/app/services/api/api.service';

@Component({
  selector: 'app-kegg-pathway-viewer',
  templateUrl: './kegg-pathway-viewer.component.html',
  styleUrls: ['./kegg-pathway-viewer.component.scss']
})
export class KeggPathwayViewerComponent implements OnInit {

  @ViewChild('canvasEl') canvasEl: ElementRef;
  context: CanvasRenderingContext2D;
  kegg2pathway = {};
  currPath: string;

  noimg: boolean = true;
  isLoadingImage: boolean = false;
  private imgs = [];
  uniprot: string;
  private debug: boolean;
  loading = false;
  selectedImage = null;

  private pathwaydb = [];
  //private items: Observable<Lmpd_Arapidopsis[]>;
  items = [];

  private imgUrl: SafeResourceUrl;
  private imgID: string;
  private showImg: boolean;
  private showLinkList: boolean;
  private defaultValue1 = 'null';
  private defaultValue2 = 'null';
  private linkList = [];
  pathwayList = [];

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
  query:string = "";
  relatedGeneNames = [];
  selectedFPID = "";
  displayedGeneColumns = ["uniprot_id", "geneName", "proteinNames"];
  noRes = true;
  hasSearched = false;


  constructor(private sanitizer: DomSanitizer, 
    private http: HttpClient, 
    private db: APIService) {
    this.pathwaydb = [];

    this.http.get('/static/reactome.csv', {responseType: 'text'}).subscribe(data => {
      for (const line of data.split(/[\r\n]+/)) {
        // console.log(line.split(','));
        this.pathwaydb.push(line.split(','));
      }
      //console.log(this.pathwaydb);
      this.pathwaydb.sort(function(a, b) {
        if (a[a.length-1] < b[b.length-1]) return -1;
        if (a[a.length-1] > b[b.length-1]) return 1;
        return 0;
      });
    });
  }

  ngOnInit() {

  }

  getPathways() {
    this.pathwayList = [];
    this.loading = true;
    this.selectedImage = null;

    this.db.getPathwaysByUniProt(this.selectedSpecies, this.uniprot).subscribe((data: any) => {
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

      this.loading = false;
    }, error => {
      this.loading = false;
      this.noimg = true;
    });
  }

  public OnSubmit() {
    this.selectedImage = null;
    this.hasSearched = true;
    // this.loading = true;
    // this.debug = false;
    // this.pathwayList = [];
    this.noimg = false;
    this.noRes = false;
  
    this.relatedGeneNames = [];
    this.pathwayList = [];
    this.loading = true;

    this.clearCanvas();

    this.db.searchSQLAPI(this.query, this.selectedSpecies).subscribe((data:any[]) => {
      if (data && data.length > 0) {
        if (data.length > 1) {
          this.relatedGeneNames = data.slice(0, 10);
        }

        this.uniprot = data[0].uniprot_id;
        this.selectedFPID = data[0].fp_id;

        this.getPathways();
      }
      else {
        this.noRes = true;
        this.loading = false;
      }
    }, error => {
      this.noRes = true;
      this.loading = false;
    });

  }

  changeSpecies(e) {
    this.selectedSpecies = e.value;
  }

  selectColumn(uniprot_id: string, fp_id: string) {
    this.uniprot = uniprot_id;
    this.selectedFPID = fp_id;
    this.clearCanvas();
    this.getPathways();
  }

  setDefaultSearch() {
    this.query = "A8MR93";
  }

  selectImage(pathway: string) {
    this.isLoadingImage = true;
    
  }

  loadImage(pathway){
    //var id = selected[0]._value.slice(5);
    this.isLoadingImage = true;
    var id = pathway;
    
    this.selectedImage = environment.BASE_API_URL+"highlighted_image/?species="+this.selectedSpecies+"&uniprot_id="+this.uniprot+"&pathway_id="+pathway;

    //TODO
    //Clear canvas before load new image
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    var canvas = (this.canvasEl.nativeElement as HTMLCanvasElement);
    this.context.clearRect(0,0,canvas.width,canvas.height);
    var elemLeft = canvas.offsetLeft + canvas.clientLeft;
    var elemTop = canvas.offsetTop + canvas.clientTop;
    var elements = [];
    this.http.get(environment.BASE_API_URL+'getcoordinates/?pathway_id='+id, {responseType: 'text'}).subscribe(data => {
      for (const line of data.substr(1).slice(0, -1).split('\\n')) {
        if (line.slice(0, 4) === 'rect') {
          var linesplit = line.split('\\t');
          var pos = linesplit[0];
          var url = linesplit[1];
          var possplit = pos.split(' ');
          var topleft = possplit[1];
          var bottomright = possplit[2];
          topleft = topleft.slice(1,-1);
          bottomright = bottomright.slice(1,-1);
          var top = toNumbers(topleft.split(',')[1])[0];
          var left = toNumbers(topleft.split(',')[0])[0];
          var bottom = toNumbers(bottomright.split(',')[1])[0];
          var right = toNumbers(bottomright.split(',')[0])[0];
          elements.push({
            colour: '#FFFFFF',
            width: right-left,
            height: bottom-top,
            top: top,
            left: left,
            url: url
          })

        }
      }
      canvas.addEventListener('click',function(event) {
        // var x = event.pageX - elemLeft;
        // var y = event.pageY - elemTop;
        var x = event.offsetX
        var y = event.offsetY
        console.log(event);
        console.log(elemLeft);
        console.log(elemTop);
        // Collision detection between clicked offset and element.

        elements.forEach(function(element) {
          if (y > element.top && y < element.top + element.height
            && x > element.left && x < element.left + element.width) {
            //alert('clicked an element');
            window.open('http://www.kegg.jp'+element.url);

          }
        })},false);

      canvas.addEventListener('mousemove',function(event) {
        var x = event.offsetX;
        var y = event.offsetY;
        var isIn = false;
        elements.forEach(function(element) {
          if (y > element.top && y < element.top + element.height
            && x > element.left && x < element.left + element.width) {
            isIn = true;
            canvas.style.cursor = "pointer";
          }
        })
        if (!isIn){
          canvas.style.cursor = "default";
        }
      },false);

      var ctx = this.context;
      elements.forEach(function(element) {
        ctx.fillStyle = element.colour;
        ctx.fillRect(element.left, element.top, element.width, element.height);
      });​

      // var img1 = document.getElementById('pathway1') as HTMLImageElement;
      // ctx.drawImage(img1,0,0);
      var img1 = new Image();
      img1.onload = () => {
        this.isLoadingImage = false;
        ctx.canvas.height = img1.height;
        ctx.canvas.width = img1.width;
        ctx.drawImage(img1,0,0)
      }
        //img1.src = 'https://us-central1-linux-shell-test.cloudfunctions.net/keggget?cfg=get&para=image&id=' + id;
        img1.src = this.selectedImage;

    });
  }

  clearCanvas(){
    this.context = (this.canvasEl.nativeElement as HTMLCanvasElement).getContext('2d');
    var canvas = (this.canvasEl.nativeElement as HTMLCanvasElement);
    this.context.clearRect(0,0,canvas.width,canvas.height);
  }
}