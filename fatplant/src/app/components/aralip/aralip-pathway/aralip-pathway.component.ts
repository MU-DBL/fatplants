import { Component, OnInit } from '@angular/core';
import { APIService } from '../../../services/api/api.service';

@Component({
  selector: 'app-aralip-pathway',
  templateUrl: './aralip-pathway.component.html',
  styleUrls: ['./aralip-pathway.component.scss']
})
export class AralipPathwayComponent implements OnInit {
  selectedOption;
  id="2";
  name="";
  path="";
  legend="";
  abbreviation=""


  pathwayOptions = [
  {
    id: "2",
    //img: "/app/assets/pathwayImages/aralip/fatty_acid_synthesis.GIF",
    name: "Fatty Acid Synth"
  },
  {
    id: "3",
    name: "Plast FAE & Desat"
  },
  {
    id: "4",
    name: "Prok Gal/Sulpho I"
  },
  {
    id: "5",
    name: "Prok Gal/Sulpho II"
  },
  {
    id: "6",
    name: "Euk Gal/Sulpho"
  },
  {
    id: "7",
    name: "TAG Synthesis"
  },
  {
    id: "8",
    name: "Euk Phospholipid"
  },
  {
    id: "9",
    name: "TAG Degradation"
  },
  {
    id: "10",
    name: "FA Elong & Wax"
  },
  {
    id: "11",
    name: "Sphingolipid I"
  },
  {
    id: "12",
    name: "Sphingolipid II"
  },
  {
    id: "13",
    name: "Mito FAS & Lipoic"
  },
  {
    id: "14",
    name: "Mito Phospholipid"
  },
  {
    id: "15",
    name: "Mito LipoPolySach"
  },
  {
    id: "15",
    name: "Trafficking"
  },
  {
    id: "17",
    name: "Cutin I"
  },
  {
    id: "18",
    name: "Cutin II"
  },
  {
    id: "19",
    name: "Suberin I"
  },
  {
    id: "20",
    name: "Suberin II"
  },
  {
    id: "21",
    name: "Suberin III"
  },
  {
    id: "22",
    name: "Oxylipin I"
  },
  {
    id: "23",
    name: "Oxylipin II"
  },
  {
    id: "24",
    name: "Signaling"
  },
];

  constructor(private apiService: APIService) { }

  ngOnInit(): void {
    this.selectedOption = this.pathwayOptions[0];
    //this.img = new Image();
    this.onChange(this.pathwayOptions[0])
  }

  onChange(newOption) {
    console.log('entered onChange',newOption);
    this.selectedOption = newOption;
    this.apiService.pathwayEnzyme(newOption.id).subscribe((data: any[]) => {
      //this.soybeanDataSource = new MatTableDataSource(data);
      this.path=data[0].path;//TO DO:if data is empty?
      this.id=newOption.id;
      this.name=data[0].name;
      this.legend=data[0].legend;
      this.abbreviation=data[0].abbreviation;
    }, error => {
      //this.soybeanDataSource = new MatTableDataSource([]);
    });
  }

}
