import { Component, OnInit } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { ActivatedRoute } from '@angular/router';
import { Lmpd_Arapidopsis } from 'src/app/interfaces/lmpd_Arapidopsis';
import { ProteinEntry } from 'src/app/interfaces/ProteinEntry';
import { FunctionEntry } from 'src/app/interfaces/FunctionEntry';
import { MatTableDataSource } from '@angular/material/table';
import { NotificationService } from 'src/app/services/notification/notification.service';
import { FirestoreAccessService } from 'src/app/services/firestore-access/firestore-access.service';
import { MatDialog } from '@angular/material/dialog';
import { GptDialogComponent } from 'src/app/components/commons/gpt-dialog/gpt-dialog.component';
import { FirestoreConnectionService } from 'src/app/services/firestore-connection.service';

@Component({
  selector: 'app-protein-detail',
  templateUrl: './protein-detail.component.html',
  styleUrls: ['./protein-detail.component.scss']
})
export class ProteinDetailComponent implements OnInit {

  constructor(private afs: AngularFirestore, 
              private route: ActivatedRoute, 
              public notificationService: NotificationService, 
              private access: FirestoreAccessService,
              public dialog: MatDialog, 
              private db: FirestoreConnectionService) { }

  translationObject;
  uniprotId;
  arapidopsisData: any;
  proteinData: any;
  proteinEntry;
  functions: FunctionEntry[];
  isLoadingArapidopsis = true;
  proteinDataSource: MatTableDataSource<FunctionEntry>;
  isLoadingProtein = true;
  displayedColumns = [
    'type',
    'start',
    'end',
    'length',
    'description'
  ]

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

/*
  getUniprotData_Old() {
    this.afs.collection('/New_Lmpd_Arabidopsis', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
      this.arapidopsisData = res[0];
      if (this.arapidopsisData !== undefined) {
        this.arapidopsisData.gene_names = this.arapidopsisData.gene_names.replaceAll(' ', ', ');
        this.proteinEntry = this.arapidopsisData.protein_entry;
        this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
        
        //this.access.getMapForArabidopsis(this.arapidopsisData.uniprot_id).subscribe(translation => {
        this.db.searchSpeciesMapper("arabidopsis",encodeURIComponent(this.arapidopsisData.uniprot_id)).subscribe(translation => {
          this.translationObject = translation;
        })
        
        this.getProteinEntry();
      }
      else {
        this.isLoadingProtein = false;
      }
      this.isLoadingArapidopsis = false;
    });
  }
    */

//switched from Firestore to MySQL
  getUniprotData() {
    //this.afs.collection('/New_Camelina', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
    this.db.getDetailByUniprotid("lmpd",encodeURIComponent(this.uniprotId)).subscribe((res: any) => {
      this.arapidopsisData = res[0];
      this.arapidopsisData.protein_name=this.arapidopsisData.protein_names
      if (this.arapidopsisData !== undefined) {
        this.arapidopsisData.gene_names = this.arapidopsisData.gene_names.replaceAll(' ', ', ');
        this.proteinEntry = this.arapidopsisData.protein_entry;
        this.proteinDataSource = new MatTableDataSource<FunctionEntry>(this.arapidopsisData.features);
        
        //this.access.getMapForCamelina(this.arapidopsisData.uniprot_id).subscribe(translation => {
        this.db.searchSpeciesMapper("arabidopsis",encodeURIComponent(this.arapidopsisData.uniprot_id)).subscribe(translation => {
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
      }
      else {
        this.isLoadingProtein = false;
      }
      this.isLoadingArapidopsis = false;
    });
  }

  //combined into getUniprotData() since they're now using the same table
  /*
  getProteinEntry() {
    this.afs.collection('/New_Lmpd_Arabidopsis_Details', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
      this.proteinData = res[0];

      if (this.proteinData === undefined) {
        this.afs.collection('/New_Lmpd_Arabidopsis_Details', ref => ref.limit(1).where('uniprot_id', '==', this.uniprotId)).valueChanges().subscribe((res: any) => {
          this.proteinData = res[0];
          this.isLoadingProtein = false;
        });
      }
      else {
        this.isLoadingProtein = false;
      }

      this.splitGeneNames = this.proteinData.gene_names.split(' ');
      this.selectedGPTQuery = this.splitGeneNames[0];
    });
  }
    */
   
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
