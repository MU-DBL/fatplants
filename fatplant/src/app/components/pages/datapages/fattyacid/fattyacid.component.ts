import { Component, OnInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';
import { FirestoreConnectionService } from 'src/app/services/firestore-access/firestore-connection.service';
import { FatPlantDataSource } from 'src/app/interfaces/FatPlantDataSource';
import {globalRefreshTime} from '../../../../constants';


@Component({
  selector: 'app-fattyacid',
  templateUrl: './fattyacid.component.html',
  styleUrls: ['./fattyacid.component.css']
})
export class FattyacidComponent implements OnInit {

  displayedColumns = ['picture','name','mass','sofa_id','other_names','delta_notation'];
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  dataSource:MatTableDataSource<any>;
  loading: boolean;
  constructor(private db:FirestoreConnectionService) { }

  ngOnInit() {
    this.loading = true;
    var localFattyAcidData: FatPlantDataSource = JSON.parse(localStorage.getItem('fattyacid_data'));
    if (localFattyAcidData != null && (Date.now() - localFattyAcidData.retrievalDate <= globalRefreshTime)) {
      this.dataSource = new MatTableDataSource(localFattyAcidData.data);
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
    refreshData() {
      localStorage.removeItem('fattyacid_data');
      this.dataSource = null;
      this.getDBData();
  
    }
    getDBData() {
      this.loading = true;
      let docs=this.db.connect('Fatty Acid').subscribe(data =>{
        this.dataSource=new MatTableDataSource(data)
        this.dataSource.paginator = this.paginator;
        let fattyAcidData: FatPlantDataSource = {
          retrievalDate: Date.now(),
          data: data
        };
        localStorage.setItem('fattyacid_data', JSON.stringify(fattyAcidData));
        this.loading = false;
      });
    }

}
