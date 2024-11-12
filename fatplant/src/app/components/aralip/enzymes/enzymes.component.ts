import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ActivatedRoute} from '@angular/router';
import { APIService } from '../../../services/api/api.service';

@Component({
  selector: 'app-enzymes',
  templateUrl: './enzymes.component.html',
  styleUrls: ['./enzymes.component.scss']
})
export class EnzymesComponent implements OnInit {
  locusDataSource: MatTableDataSource<any>;
  id="2";
  name="";
  reactions=[];
  pathways=[];
  locus=[];
  //test="";
  ref_selected=null;
  mutant_selected=null;
  est_selected=false;
  isPopupOpen = false;

  constructor(private route: ActivatedRoute, private apiService: APIService) { 
    this.route.paramMap.subscribe(params => {
      this.id = params.get('id');
      if(!this.id){
        this.id="1"
      }else if(parseInt(this.id)<1 || parseInt(this.id)>270){
        this.id="1"
      }
    });
  }

  ngOnInit(): void {
    this.apiService.getEnzymeName(this.id).subscribe((data: any[]) => {
      this.name=data[0].name;//TO DO:if data is empty?
    }, error => {
    });

    this.apiService.getEnzymeReaction(this.id).subscribe((data: any[]) => {
      this.reactions=data;
      //this.test=this.reactions[0].ecnumber;
    }, error => {
    });

    this.apiService.getEnzymePathway(this.id).subscribe((data: any[]) => {
      this.pathways=data;
    }, error => {
    });

    this.apiService.getEnzymeLocus(this.id).subscribe((data: any[]) => {
      this.locus=data;
      this.locusDataSource = new MatTableDataSource(data);
    }, error => {
    });
  }

  closeRefPopup() {
    this.ref_selected=null;
  }

  closeMutantPopup() {
    this.mutant_selected=null;
  }

  closeEstPopup() {
    this.est_selected=false;
  }

  showRef(data: any): void{
    this.mutant_selected=null;
    this.ref_selected=data;
    this.est_selected=false;
  }

  showMutant(data: any): void{
    this.mutant_selected=data;
    this.ref_selected=null;
    this.est_selected=false;
  }

  showEst(): void{
    this.mutant_selected=null;
    this.ref_selected=null;
    this.est_selected=true;
  }

  convertToHtml(input: String): String {
    let htmlString = input.replace(/~(.*?)~/g, '<sub>$1</sub>');
    htmlString = htmlString.replace(/\^(.*?)\^/g, '<sup>$1</sup>');
    return htmlString;
  }
}
