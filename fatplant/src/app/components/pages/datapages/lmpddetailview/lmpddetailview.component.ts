import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FormsModule } from '@angular/forms';
// import { TabService } from '../../../../tab.service';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore'
import { FirestoreConnectionService } from '../../../../services/firestore-access/firestore-connection.service';
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import {Observable} from 'rxjs';
import {DataSource} from '@angular/cdk/collections'
import { HttpClient } from '@angular/common/http';
declare var require: any;

@Component({
  selector: 'app-lmpddetailview',
  templateUrl: './lmpddetailview.component.html',
  styleUrls: ['./lmpddetailview.component.css'],
  providers: []
})

export class LmpddetailviewComponent implements OnInit {
  public tabs = [];
  public tabtitles = [];
  public arr2 = [];
  public errorMsg;
  csvContent: string;
  private uniprot_id: any;
  items: any;
  private result: any;
  private tabresult: any;
  private detailresult: any;
  private moreresult: any;
  private tabitem: any;
  detailitem: any;
  private moreitem: any;
  private sub: any;
  resultsequence: any;

  // displayedColumns = ['Entry','Entry_name','Status','Protein_names','Gene_names','Organism','Length','Chain'];
  // displayedColumns = ['Entry','Status','Organism','Length','Chain'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  displayedColumns = ['term','start','end','details','evidence'];// columns for Domains table
  dataSource:MatTableDataSource<any>;
  constructor(private db:FirestoreConnectionService,private afs:AngularFirestore, private route: ActivatedRoute) {

   }
  ngOnInit() {
    //get uniprotID from url for searching later
    this.sub = this.route.params.subscribe(params => {
       this.uniprot_id = params['uniprot_id'];
       console.log(this.uniprot_id);
    })


    //get data from Lmpd_Arapidopsis table
    this.afs.collectionGroup('Lmpd_Arapidopsis', ref => ref)
       .valueChanges().subscribe(res => {
       this.tabresult = res as string [];
       let i: number = 0;
       this.tabitem = this.tabresult[0];
       console.log(this.tabitem);

    })

    //get data from Lmpd_Arapidopsis_Detail1 table by uniprot_id
    this.afs.collectionGroup('Lmpd_Arapidopsis_Detail1', ref => ref.where('entry', '==', this.uniprot_id))
       .valueChanges().subscribe(res => {
       this.detailresult = res as string [];
       this.detailitem = this.detailresult[0];
       console.log(this.detailitem);

    })
    //get data from Lmpd_Arapidopsis_Evidence table by uniprot_id
    this.afs.collectionGroup('Lmpd_Arapidopsis_Evidence', ref => ref.where('uniprotID', '==', this.uniprot_id))
       .valueChanges().subscribe(res => {
       this.dataSource = new MatTableDataSource(res);
       this.moreresult = res as string [];
       this.moreitem = this.moreresult[0];
       console.log(this.moreresult);
       console.log(this.dataSource);
    })

    //get data from Lmpd_Arapidopsis table by uniprot_id
    this.afs.collectionGroup('Lmpd_Arapidopsis', ref => ref.where('uniprot_id', '==', this.uniprot_id))
       .valueChanges().subscribe(res => {
       this.result = res as string [];
       this.items = this.result[0];
       console.log(this.result[0]);

       let count: number = 1;
       let i: number = 0;
       let j: number = 9;
       let l: number = this.items.seqlength;
       let sequenceorigin: string = this.items.sequence;
       let sequencegroup: string = '';
       // reorganize sequence for better looking
       do {

         sequencegroup = sequencegroup + sequenceorigin.substring(i,j);
         if (count % 5 == 0){
           sequencegroup = sequencegroup + '\n';
         }else{
           sequencegroup = sequencegroup + ' ';
         }
         count++;
         i=i+10;
         j=j+10;
       } while (i < l)
       this.resultsequence=sequencegroup;

    })

  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }

  // onFileLoad(fileLoadedEvent) {
  //     const textFromFileLoaded = fileLoadedEvent.target.result;
  //     this.csvContent = textFromFileLoaded;
  //     // alert(this.csvContent);
  //     // this.onFileLoad.subscribe(data=>{
  //     // this.tabresult=data;
  //     // })
  //     this.tabresult = this.csvContent;
  //     this.csvContent = 'hello';
  //     console.log(this.csvContent);
  //     let ss: string = '';
  //     let arr: string[];
  //     let underarr: string[];
  //     let i: number = 0;
  //     let j: number = 0;
  //     console.log(this.tabresult);
  //     arr = this.tabresult.split("\n");
  //     // arr = this.tabresult.split("\t");
  //     for(i = 0; i < arr.length; i++){
  //       console.log(arr[i]);
  //       underarr = arr[i].split("\t");
  //       for(j = 0; j < underarr.length; j++){
  //         console.log(underarr[j]);
  //       }
  //     }
  //   }
  //
  //   onFileSelect(input: HTMLInputElement) {
  //
  //     const files = input.files;
  //     var content = this.csvContent;
  //
  //    if (files && files.length) {
  //
  //         const fileToRead = files[0];
  //
  //         const fileReader = new FileReader();
  //         fileReader.onload = this.onFileLoad;
  //
  //         fileReader.readAsText(fileToRead, "UTF-8");
  //    }
  //  }

}
