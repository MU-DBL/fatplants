import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {HttpClient} from '@angular/common/http';
import {Router} from '@angular/router';
import {AngularFirestore} from 'angularfire2/firestore';
import {MatTableDataSource} from "@angular/material/table";
import {animate, state, style, transition, trigger} from '@angular/animations';

@Component({
  selector: 'app-blast-page',
  templateUrl: './blast-page.component.html',
  styleUrls: ['./blast-page.component.scss'],
  animations: [
    trigger('detailExpand', [
      state('void', style({height: '0px', minHeight: '0', visibility: 'hidden'})),
      state('*', style({height: '*', visibility: 'visible'})),
      transition('void <=> *', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
  ],
})
export class BlastPageComponent implements OnInit {

  blastDataSource: MatTableDataSource<any>;

  public method: string;
  public proteinSeq: string;
  public database: string;
  public matrix: string;
  public evalue: string;
  public items: any;

  isLoading: boolean;
  result: string;
  blastRes = [];
  loading = false;
  blastError = false;
  alertVisible = false;
  blastForm: FormGroup;
  constructor(private http: HttpClient, private router: Router, db: AngularFirestore) {
    this.database = 'Arabidopsis';
    this.evalue = "1";
    this.matrix = "BLOSUM62";
    this.alertVisible = false;
  }
  onSubmit() {
    if (this.proteinSeq === undefined){
      this.showAlert();
      return;
    }
    if (this.proteinSeq.length<1){
      this.showAlert();
      return;
    }
    this.loading = true;
    this.blastError = false;
    // this.http.post('https://linux-shell-test.appspot.com/blastp', {fasta: this.proteinSeq, database: this.database, matrix: this.matrix, evalue: this.evalue}, {responseType: 'text'}).subscribe((res: any) => {
    this.http.get('https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/blastp?fasta=' + this.proteinSeq + '&database=' + this.database + '&matrix=' + this.matrix + '&evalue=' + this.evalue, {responseType: 'text'}).subscribe((res: any) => {
      this.result = res;
        this.SplitRes(res);
        this.loading = false;
        //console.log(res);
    });
  }
  ngOnInit() {
  }

  SplitRes(result: string) {
    let lines = result.split('\n');
    let start = 0;
    let header = [];
    let headerIndex = 0;
    for (var l in lines){
      //console.log(l,lines[l]);
      if (lines[l].indexOf('Sequences producing significant alignment')!= -1){
        start = Number(l);
      }
    }
    if (start != 0){
      start+=2;
      while (lines[start].length>0){
        let scoreEvalue = lines[start].substring(70,lines[start].length).split(' ');
        header.push([lines[start].substring(0,70),Number(lines[start].substring(70,81)),Number(lines[start].substring(81,lines[start].length))]);
        start+=1;
      }
    }
    console.log(header);

    this.blastRes = [];
    let tmp: any;
    tmp = result.split('>');
    tmp.shift();
    let index: number;
    if (tmp[tmp.length - 1] == undefined) {
      this.blastError = true;
      this.result = undefined;
    }
    else {
      index = tmp[tmp.length - 1].search('Lambda');
      tmp[tmp.length - 1] = tmp[tmp.length - 1].substring(0, index);
      for (var i in tmp) {
        var extract = tmp[i].split('\n');
        var ScoreExpect = extract[4].split(',');
        var IdentitiesPositivesGaps = extract[5].split(',');
        var score = ScoreExpect[0].match(/=(.*)/)[1];
        var expect = ScoreExpect[1].match(/=(.*)/)[1];
        var identities = IdentitiesPositivesGaps[0].match(/=(.*)/)[1];
        var positives = IdentitiesPositivesGaps[1].match(/=(.*)/)[1];
        var gaps = IdentitiesPositivesGaps[2].match(/=(.*)/)[1];

        //console.log(ScoreExpect);
        //console.log(IdentitiesPositivesGaps);
        //console.log(score);
        //console.log(expect);
        //console.log(identities);

        this.blastRes.push({'sequences':header[headerIndex][0],'score':score,'evalue':expect,'expand':tmp[i],'identities':identities,'positives':positives,'gaps':gaps})
        headerIndex+=1;
      }
    }
    this.blastDataSource = new MatTableDataSource(this.blastRes);
  }

  changeDatabase(newDatabase: string) {
    this.database = newDatabase;
  }

  clear() {
    this.result = undefined;
    this.blastRes = [];
    this.blastDataSource = undefined;
  }
  setDefaultSearch() {
    this.proteinSeq = "MEVKARAPGKIILAGEHAVVHGSTAVAAAIDLYTYVTLRFPLPSAENNDRLTLQLKDISLEFSWSLARIKEAIPYDSSTLCRSTPASCSEETLKSIAVLVEEQNLPKEKMWLSSGISTFLWLYTRIIGFNPATVVINSELPYGSGLGSSAALCVALTAALLASSISEKTRGNGWSSLDETNLELLNKWAFEGEKIIHGKPSGIDNTVSAYGNMIKFCSGEITRLQSNMPLRMLITNTRVGRNTKALVSGVSQRAVRHPDAMKSVFNAVDSISKELAAIIQSKDETSVTEKEERIKELMEMNQGLLLSMGVSHSSIEAVILTTVKHKLVSKLTGAGGGGCVLTLLPTGTVVDKVVEELESSGFQCFTALIGGNGAQICY";
  }

  showAlert() : void {
    alert("Sequence should not be empty");
    console.log("alert")
  }
}


