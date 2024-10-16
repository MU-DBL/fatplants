import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';


@Injectable({
  providedIn: 'root'
})
export class AralipsServiceService {

  constructor(private afs:AngularFirestore) { }

  getAllPathways() {
    return this.afs.collection("AralipsPathways").snapshotChanges();
  }

  getPathwayByTitle(title:string) {
    return this.afs.collection("AralipsPathways").doc(title).snapshotChanges();
  }

}
