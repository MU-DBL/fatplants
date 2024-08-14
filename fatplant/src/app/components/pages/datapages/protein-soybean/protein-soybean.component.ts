import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FunctionEntry } from 'src/app/interfaces/FunctionEntry';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { GptDialogComponent } from 'src/app/components/commons/gpt-dialog/gpt-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { APIService } from '../../../../services/api/api.service';

@Component({
  selector: 'app-protein-soybean',
  templateUrl: './protein-soybean.component.html',
  styleUrls: ['./protein-soybean.component.scss']
})
export class ProteinSoybeanComponent implements OnInit {

  constructor(private route: ActivatedRoute, 
              public notificationService: NotificationService,
              public dialog: MatDialog, 
              private apiService: APIService) { }

  translationObject;
  uniprotId;
  arapidopsisData: any;
  proteinData: any;
  proteinEntry;
  functions: FunctionEntry[];
  isLoadingArapidopsis = true;
  proteinDataSource: MatTableDataSource<FunctionEntry>;
  isLoadingProtein = true;

  selectedGPTQuery = "";
  splitGeneNames = [];

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.uniprotId = params['uniprot_id'];
      this.getUniprotData();
    });
    
  }

  openGptDialog() {
    const dialogRef = this.dialog.open(GptDialogComponent, {
      data: {identifier: this.selectedGPTQuery}
    });
  }

//switched from Firestore to MySQL
  getUniprotData() {
    this.apiService.getDetailByUniprotid("soya",encodeURIComponent(this.uniprotId)).subscribe((res: any) => {
      this.arapidopsisData = res[0];
      if (this.arapidopsisData !== undefined) {
        this.arapidopsisData.gene_names = this.arapidopsisData.gene_names.replaceAll(' ', ', ');
        
        this.apiService.searchSpeciesMapper("glymine_max",encodeURIComponent(this.arapidopsisData.uniprot_id)).subscribe(translation => {
          this.translationObject = translation;
          this.proteinData = res[0];
          if (this.proteinData === undefined) {
            this.proteinData.gene_names = this.proteinData.gene_names.replaceAll(' ', ', ');

            this.splitGeneNames = this.proteinData.gene_names.split(',');

            this.isLoadingProtein = false;
          }
          else {
            this.splitGeneNames = this.proteinData.gene_names.split(' ');
            this.isLoadingProtein = false;
          }
          this.selectedGPTQuery = this.splitGeneNames[0];
        })
        this.proteinEntry = this.arapidopsisData.protein_entry;
        this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
      }
      else {
        this.isLoadingProtein = false;
      }
      this.isLoadingArapidopsis = false;
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

}
