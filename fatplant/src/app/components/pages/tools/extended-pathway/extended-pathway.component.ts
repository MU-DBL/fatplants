import { HttpClient } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild, Renderer2 } from '@angular/core';
import {tairDict, objList} from './existing_tairs';
import {Pipe, PipeTransform} from '@angular/core';

// we need to exclude in_fp from the list of displayed columns
// because it is different and needs to be explicitely defined
// in the template

@Pipe ({
  name : 'excludeListItem'
})

export class ExcludeListItemPipe implements PipeTransform {
  transform(items: any[], exclusion: any): any {
      if (!items) {
          return items;
      }
      return items.filter(item => item != exclusion);
  }
}

@Component({
  selector: 'app-extended-pathway',
  templateUrl: './extended-pathway.component.html',
  styleUrls: ['./extended-pathway.component.scss']
})
export class ExtendedPathwayComponent implements OnInit {

  constructor(private httpClient: HttpClient, private renderer: Renderer2,) { }

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  ctx;
  canvasListener: any;
  clickRects: any;
  bm:ImageBitmap;
  hoveredRects = [];
  img;
  selectedGraph = [];
  selectedOption;
  loading = true;

  selectedTair = "";
  selectedDetails = [{ 
    tair_id: "",
    protein: "",
    rna_seq: "",
    trap_seq: "",
    prot_log2FC: "",
    prot_qvalue : "",
    prot_pvalue: "",
    trans_log2FC: "",
    trans_qvalue: "",
    log2_transcriptomeChanges: "",
    log2_translatomeChanges: "",
    log2_TE: "",
    Zscore_Log2_TE: "",
    description: ""
  }];

  selectedUniprot = "";
  columnSections = [
    ["in_fp","protein","rna_seq",	"trap_seq"],
    ["in_fp","prot_log2FC",	"prot_qvalue", "prot_pvalue"],
    ["in_fp","trans_log2FC",	"trans_qvalue"],
    ["in_fp","log2_transcriptomeChanges","log2_translatomeChanges","log2_TE","Zscore_Log2_TE"]
  ];

  columnTitles = {
    protein: "Protein",
    rna_seq: "RNA-Seq",
    trap_seq: "Trap-Seq",
    prot_log2FC: "Log2FC",
    prot_qvalue: "q Value",
    prot_pvalue: "p Value",
    trans_log2FC: "Log2FC",
    trans_qvalue: "q Value",
    log2_transcriptomeChanges: "log2_transcriptomeChanges",
    log2_translatomeChanges: "log2_translatomeChanges",
    log2_TE: "log2_TE",
    Zscore_Log2_TE: "Zscore_Log2_TE"
  };

  displayedColumns = this.columnSections[0];

  // link: image path, data: json path, name: display name in dropdown
  pathwayOptions = [
    {
      link: "/app/assets/pathwayImages/extendedImages/pathway1.png",
      data: "/app/assets/pathwayImages/extendedImages/pathway1.json",
      name: "Image 1"
    },
    {
      link: "/app/assets/pathwayImages/extendedImages/pathway2.png",
      data: "/app/assets/pathwayImages/extendedImages/pathway2.json",
      name: "Image 2"
    },
    {
      link: "/app/assets/pathwayImages/extendedImages/pathway3.png",
      data: "/app/assets/pathwayImages/extendedImages/pathway3.json",
      name: "Image 3"
    },
    {
      link: "/app/assets/pathwayImages/extendedImages/pathway4.png",
      data: "/app/assets/pathwayImages/extendedImages/pathway4.json",
      name: "Image 4"
    }
  ];

  ngOnInit(): void {
    this.selectedOption = this.pathwayOptions[0];
    this.img = new Image();
    this.img.src = this.selectedOption.link;
    this.img.onload = () => this.loadCoordinates();
  }

  changeTable(event) {
    this.displayedColumns = this.columnSections[event.index];
  }

  // when the select input is changed
  onChange(newOption) {
    this.loading = true;
    this.selectedOption = newOption;
    this.img = new Image();
    this.img.src = this.selectedOption.link;
    this.img.onload = () => this.loadCoordinates();
  }

  loadCoordinates() {
    this.loading = false;
    this.httpClient.get(this.selectedOption.data).subscribe((data:any) => {
      let baseGraph = data.shapes;
      this.selectedGraph = [];
      baseGraph.forEach(box => {

        let posX = box.points[0][0];
        let posY = box.points[0][1];
        let width = box.points[1][0] - posX;
        let height = box.points[1][1] - posY;

        this.selectedGraph.push({
          label: box.label,
          posX: posX,
          posY: posY,
          width: width,
          height: height
        })
      });

      this.drawMap();
    });
  }

  navigateToProtein() {
    if (this.selectedUniprot)
      window.open('/protein/' + this.selectedUniprot, '_blank');
  }

  drawMap() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.clickRects = [];

    createImageBitmap(this.img,0,0,this.img.width,this.img.height).then(bm => {
      this.bm = bm;
      this.ctx.drawImage(this.bm,0,0);

      this.selectedGraph.forEach(box => {

        // adjust them for the rescaled canvas (only for pointer)
        var adjRectWidth = (box.width / this.img.width) * this.canvas.nativeElement.scrollWidth;
        var adjRectHeight = (box.height / this.img.height) * this.canvas.nativeElement.scrollHeight;

        var pointX = (box.posX / this.img.width) * this.canvas.nativeElement.scrollWidth;
        var pointY = (box.posY / this.img.height) * this.canvas.nativeElement.scrollHeight;

        // add new point to list and to the ctx (non-adjusted)
        var newPath = new Path2D();
        var newPicPath = new Path2D();

        newPicPath.rect(box.posX, box.posY, box.width, box.height);
        newPath.rect(pointX, pointY, adjRectWidth, adjRectHeight);

        this.clickRects.push(
          { 
            path: newPath,
            picPath: newPicPath,
            label: box.label,
            coords: {
              x:box.posX, 
              y:box.posY, 
              w:box.width, 
              h:box.height
            }
          });
      });

      // now let's define the hover behavior for each of them
      this.canvasListener = this.renderer.listen(this.canvas.nativeElement, 'mousemove', (e) => {
        
        // clear the rectangle's we're hovering over
        this.hoveredRects = [];

        // clear the painted rects
        this.ctx.drawImage(this.bm,0,0);

        this.ctx.beginPath();

        this.clickRects.forEach((rect, i) => {
          // add all the rects under the mouse to the array
          if(this.ctx.isPointInPath(rect.path, e.offsetX, e.offsetY)) {
            this.hoveredRects.push(rect);
          }
        });
        
        // paint all the rects the mouse is touching
        this.hoveredRects.forEach(rect => {
          this.ctx.fillStyle = "rgba(219,112,147,0.3)";
          this.ctx.fill(rect.picPath);
        });
      });

      // now let's define the click behavior for each of them
      this.canvasListener = this.renderer.listen(this.canvas.nativeElement, 'click', (e) => {
        var hasOpenedDialog = false;
        
        this.clickRects.forEach(rect => {
          if (this.ctx.isPointInPath(rect.path, e.offsetX, e.offsetY)) {
            if (this.hoveredRects.length == 1){
              this.selectedDetails = [objList.find(o => o.tair_id == rect.label)];
              this.selectedUniprot = tairDict[rect.label];
              this.selectedTair = rect.label;
            }
            else if (this.hoveredRects.length != 0 && !hasOpenedDialog) {
              // hasOpenedDialog = true;
              // this.openDialog();
            }
          }
        });
      });
    });    
  }

}
