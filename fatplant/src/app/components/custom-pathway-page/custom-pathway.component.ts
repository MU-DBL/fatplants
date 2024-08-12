import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { APIService } from 'src/app/services/api/api.service';
import { ViewChild, ElementRef, Renderer2 } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { CustomPathwayDialogComponent } from '../commons/custom-pathway-dialog/custom-pathway-dialog.component';

@Component({
  selector: 'app-custom-pathway',
  templateUrl: './custom-pathway.component.html',
  styleUrls: ['./custom-pathway.component.scss']
})
export class CustomPathwayComponent implements OnInit {

  constructor(private apiService:APIService,
              private activatedRoute: ActivatedRoute,
              private renderer: Renderer2,
              private dialog: MatDialog) { }

  @ViewChild('canvas', { static: true }) 
  canvas: ElementRef<HTMLCanvasElement>;
  ctx;
  canvasListener: any;
  clickRects: any;
  bm:ImageBitmap;
  hoveredRects = [];

  showingUniprot = false;
  selectedGraph = null;
  graphTable = null;
  img;

  displayedColumns = ["title", "uniProtLink", "geneName", "dataSet", "modified"];
  ngOnInit(): void {

    this.img = new Image();

    this.activatedRoute.queryParams.subscribe(params => {
      var graphId = params['id'];
      console.log("The params are : ",params);
      this.apiService.getPathwayAreaById(graphId).subscribe((graph:any[]) => {
       
        //let graphAny: any = graph.payload.data();
        if (graph == undefined) {
          this.selectedGraph = null;
        }
        else {
          console.log("The graph payload data is : ",graph);
          this.selectedGraph = graph;
          console.log("the selected graph if the graphAny is not null ",this.selectedGraph);
          // we'll use this to quickly eliminate any duplicates
          var graphHash = {};
          this.graphTable = [];

          // set the image source
          this.apiService.getPathwayImgById(graphId).subscribe((data:any[]) => {
            if (data && data.length > 0) {
              this.img.src = data[0].img_path;
            }
          });

          this.selectedGraph.forEach((graphEntry) => {
            // check the dictionary, if its not there, then
            // we need to grab this for the table
            if (graphHash[graphEntry.title] != 1) {
              // add it to the dictionary
              graphHash[graphEntry.title] = 1;

              let linkSeg = graphEntry.fp_link.split('/');
              if (linkSeg[linkSeg.length - 1] != 'undefined') {
                this.graphTable.push({
                  title: graphEntry.title,
                  fpLink: graphEntry.fp_link,
                  uniProtLink: graphEntry.uniprot_link
                });
              } 
            }
          });
          this.img.onload = () => this.drawMap();
          this.apiService.getGeneInfoByProtId(this.graphTable).subscribe(vals => {
            vals.forEach((doc, index) => {
                if (doc.docs[0] != null) {
                    this.graphTable[index].geneName = doc.docs[0].data().gene_name,
                    this.graphTable[index].dataSet = doc.docs[0].data().dataset,
                    this.graphTable[index].modified = doc.docs[0].data().modified
                }
                else {
                    this.graphTable[index].geneName = "N/A",
                    this.graphTable[index].dataSet = "N/A",
                    this.graphTable[index].modified = "N/A"
                }
            });
          });
        }
      });
    });
  }

  // this function sets up the behavior for the canvas once
  // the image has fully loaded
  drawMap() {
    this.ctx = this.canvas.nativeElement.getContext('2d');
    this.clickRects = [];

    createImageBitmap(this.img,0,0,this.img.width,this.img.height).then(bm => {
      this.bm = bm;
      this.ctx.drawImage(this.bm,0,0);

      this.selectedGraph./*areas.*/forEach(graphEntry => {//removed "areas"--Sam
        var points = graphEntry.coords.split(',');

        if (points.length == 4) {

          // we need width/height to draw on the canvas, lets calculate
          var rectWidth = points[2];
          var rectHeight = points[3];

          // adjust them for the rescaled canvas (only for pointer)
          var adjRectWidth = (rectWidth / this.img.width) * this.canvas.nativeElement.scrollWidth;
          var adjRectHeight = (rectHeight / this.img.height) * this.canvas.nativeElement.scrollHeight;

          var pointX = (points[0] / this.img.width) * this.canvas.nativeElement.scrollWidth;
          var pointY = (points[1] / this.img.height) * this.canvas.nativeElement.scrollHeight;

          // add new point to list and to the ctx (non-adjusted)
          var newPath = new Path2D(); //for hover detection
          var newPicPath = new Path2D(); //for drawing on the canvas

          newPicPath.rect(points[0], points[1], rectWidth, rectHeight);
          newPath.rect(pointX, pointY, adjRectWidth, adjRectHeight);
          this.clickRects.push(
            { 
              path: newPath,
              picPath: newPicPath,
              title: graphEntry.title,
              fpLink: graphEntry.fp_link,
              uniProtLink: graphEntry.uniprot_link,
              coords: {
                x:points[0], 
                y:points[1], 
                w:rectWidth, 
                h:rectHeight
              }
            });
        }
      });
      console.log("the click rects is : ", this.clickRects);
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
              // on click, go to the appropriate link
              if (this.showingUniprot)
                window.open(rect.uniProtLink, '_blank');
              else
                window.open(rect.fpLink, '_blank');
            }
            else if (this.hoveredRects.length != 0 && !hasOpenedDialog) {
              hasOpenedDialog = true;
              this.openDialog();
            }
          }
        });
      });
    });    
  }

  drawMapForTitle(title:string) {
    this.ctx.drawImage(this.bm,0,0);

    this.clickRects.forEach(rect => {
      
      if (rect.title == title) {
        this.ctx.beginPath();
        this.ctx.fillStyle = "rgba(219,112,147,0.3)";
        this.ctx.fill(rect.picPath);
      }
    });
  }

  clearMap() {
    this.ctx.drawImage(this.bm,0,0);  
  }

  openDialog() {
    const dialogConfig = new MatDialogConfig();

    dialogConfig.autoFocus = true;
    dialogConfig.data = {
      hoveredRects: this.hoveredRects
    }

    this.dialog.open(CustomPathwayDialogComponent, dialogConfig);
  }

  openLink(rect) {
    window.open(rect.uniProtLink, '_blank');
  }
}
