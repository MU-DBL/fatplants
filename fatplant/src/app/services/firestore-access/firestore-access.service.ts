import { Injectable } from '@angular/core';
import { AngularFirestore, AngularFirestoreCollection } from 'angularfire2/firestore';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class FirestoreAccessService {

  constructor(private afs: AngularFirestore, private http: HttpClient) { }

  get(database: string, field: string, query : string, count : number = 1, all : boolean = false)
  {
    // console.log(database, field, query);
    let items : Observable<unknown[]>;
    if (all)
    {
      items = this.afs.collection(database, ref => ref.where(field, '==', query)).valueChanges();
    }
    else if (count == 1) 
    {
      items = this.afs.collection(database, ref => ref.limit(count).where(field, '==', query)).valueChanges();
    }
    else
    {
      items = this.afs.collection(database, ref => ref.limit(count).where(field, '>=', query).where(field, '<=', query + '\uf8ff')).valueChanges();
    }
    // items.subscribe(data => console.log(data));
    return items;

  }

  // allows us to do an autofill search on gene names using the primaryGeneName field
  getGeneNameAutofill(database: string, query: string) {
    let items : Observable<unknown[]>;

    items = this.afs.collection(database, ref => ref.limit(10).where('geneName', '>=', query).where('geneName', '<=', query + '\uf8ff')).valueChanges();
    
    // items.subscribe(data => console.log(data));
    return items;
  }

  getProteinNameAutofill(database: string, query: string) {
    let items : Observable<unknown[]>;

    items = this.afs.collection(database, ref => ref.limit(10).where('primaryProteinName', '>=', query).where('primaryProteinName', '<=', query + '\uf8ff')).valueChanges();
    
    // items.subscribe(data => console.log(data));
    return items;
  }

  // get the uniprot ID from a given gene name 
  getIDSearchingArrayString(database: string, field: string, query: string) {
    let items : Observable<unknown[]>;

    items = this.afs.collection(database, ref => ref.where(field, '>=', query).where(field, '<=', query + '\uf8ff')).valueChanges();    
    // items.subscribe(data => console.log(data));
    return items;
  }

  getMapForArabidopsis(id: string) {
    return this.afs.collection("Species_Mapper", ref => ref.where("arabidopsis", "==", id)).valueChanges();
  }

  getMapForSoybean(id: string) {
    return this.afs.collection("Species_Mapper", ref => ref.where("glymine_max", "==", id)).valueChanges();
  }

  getMapForCamelina(id: string) {
    return this.afs.collection("Species_Mapper", ref => ref.where("camelina", "==", id)).valueChanges();
  }
}
