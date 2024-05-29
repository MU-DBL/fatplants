import { Injectable } from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {BehaviorSubject} from 'rxjs/BehaviorSubject';
import {Observable} from "rxjs";
import {AngularFirestore, AngularFirestoreCollection} from "@angular/fire/firestore";
import { FirestoreAccessService } from '../firestore-access/firestore-access.service';
import { environment } from 'src/environments/environment';


@Injectable(
  {
  providedIn: 'root'
}
)
export class DataService {
  public BlastNeedUpdate: boolean;
  public seqence: string;
  public loading: boolean = false;
  public g2sLoading: boolean = false;
  private blastRes: string;
  private blastResOb = new Observable<string>();

  constructor(private http: HttpClient, private fsaccess : FirestoreAccessService) {
    this.BlastNeedUpdate = true;
  }

  public updateBlastRes(database, uniprot_id): Observable<string>{
    this.blastResOb = this.http.get('https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/oneclick?fasta=' + uniprot_id + '&database=' + database, { responseType: 'text' })
    this.blastResOb.subscribe(res=>{
      this.blastRes = res;
      this.BlastNeedUpdate = false;
    })
    return this.blastResOb;
  }

  public updateBlastResult(result: any){
    this.BlastNeedUpdate = false;
    this.blastRes = result;
  }

  public getBlastRes(): string{
    return this.blastRes;
  }


  getPathwaysByUniProt(species: string, uniprot_id: string) {
    return this.http.get(environment.BASE_API_URL+"pathways/?species="+species+"&uniprot_id="+uniprot_id);
  }
}
