import { Component, OnInit, Input } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';
import {AngularFirestore,AngularFirestoreCollection} from 'angularfire2/firestore'
import { ViewChild } from '@angular/core';
import {MatPaginator} from '@angular/material/paginator';
import { FirestoreConnectionService } from 'src/app/services/firestore-access/firestore-connection.service';
import {globalRefreshTime} from '../../../../constants';


@Component({
  selector: 'app-lmpd-arapidopsis',
  templateUrl: './lmpd-arapidopsis.component.html',
  styleUrls: ['./lmpd-arapidopsis.component.css']
})
// 'https://www.uniprot.org/uniprot'+element.uniprot_id
export class LmpdArapidopsisComponent implements OnInit {
  displayedColumns = ['species','uniprot_id','refseq_id','gene_name','gene_symbol','protein_entry','protein_name','moreInfo'];

  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;

  dataSource: MatTableDataSource<any>;
  chosenelem: any;
  loading: boolean;
  headerfields=[{name: 'Protein Name',val:null},{name:'Protein Entry',val:null}
    ];
  subheaders=[{name:'Species',val:null}];
  cardfields=[{name:'Entrez Gene Id',val:null},{name:'Gene Name',val:null},{name:'Gene Symbol',val:null},{name:'Lmp ID',val:null},
  {name:'Mrna ID',val:null},{name:'Protein GI',val:null},{name:'Sequence Length',val:null},{name:'Species Long',val:null},{name:'Taxid',val:null}];
  constructor(private afs:AngularFirestore, private db:FirestoreConnectionService) { }


  ngOnInit() {
    this.loading = true;
    var localArapidopsisData: FatPlantDataSource = JSON.parse(localStorage.getItem('arapidopsis_data'));
    if (localArapidopsisData != null && (Date.now() - localArapidopsisData.retrievalDate <= globalRefreshTime)) {
      this.dataSource = new MatTableDataSource(localArapidopsisData.data);
      this.dataSource.paginator = this.paginator;
      this.loading = false;
    }
    else {
      this.getDBData();
    }
  }

  applyFilter(filterValue: string) {
      filterValue = filterValue.trim();
      filterValue = filterValue.toLowerCase();
      this.dataSource.filter = filterValue;
    }
  changeElem(elem){
    for(let entry of this.headerfields){
      entry.val=elem[entry.name.toLowerCase().replace(/ /g,"_")]
    }
    for(let entry of this.subheaders){
      entry.val=elem[entry.name.toLowerCase().replace(/ /g,"_")]
    }
    for (let entry of this.cardfields){
      entry.val=elem[entry.name.toLowerCase().replace(/ /g,"_")]
    }

  }
  refreshData() {
    localStorage.removeItem('arapidopsis_data');
    this.dataSource = null;
    this.getDBData();

  }
  getDBData() {
    this.loading = true;
    let docs=this.db.connect('Lmpd_Arapidopsis').subscribe(data =>{
      this.dataSource=new MatTableDataSource(data)
      this.dataSource.paginator = this.paginator;
      let arapidopsisData: FatPlantDataSource = {
        retrievalDate: Date.now(),
        data: data
      };
      localStorage.setItem('arapidopsis_data', JSON.stringify(arapidopsisData));
      this.loading = false;
    });
  }
}
