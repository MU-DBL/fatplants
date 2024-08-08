import { Injectable } from '@angular/core';
import { AngularFirestore } from 'angularfire2/firestore';
import { AngularFireStorage, AngularFireStorageReference } from 'angularfire2/storage';
import { forkJoin, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class CustomPathwaysService {

  constructor(private afs:AngularFirestore, private afStorage: AngularFireStorage, private http: HttpClient) { }

  ref: AngularFireStorageReference;

  //obsolete
  getPathwayByTitle(title:string) {
    return this.afs.collection("CustomizedPathways").doc(title).snapshotChanges();
  }

  addPathway(pathway) {
    return this.afs.collection("CustomizedPathways").add(pathway);
  }

  uploadPathwayImage(imgSrc, imgName) {
    // we need to generate a random id for the name, but preserve
    // the extension
    var imgNameParts = imgName.split('.');
    var extension = imgNameParts[imgNameParts.length - 1];

    const id = this.afs.createId();
    this.ref = this.afStorage.ref('images').child("customPathwayImages/" + imgNameParts[0] + " - " + id.toString() + "." + extension);
    return this.ref.put(imgSrc);
  }

  uploadPathwayCoords(coordsObjs) {
    return this.afs.collection("CustomizedPathways").add(coordsObjs);
  }

  deletePathway(pathwayId, imgUrl) {
    return this.afStorage.storage.refFromURL(imgUrl).delete().then(res => {
      this.afs.collection("CustomizedPathways").doc(pathwayId).delete();
    });
  }

  getGeneInfoByProtId(geneList) : Observable<any[]> {
    let obsList:Observable<firebase.firestore.QuerySnapshot>[] = [];
    
    geneList.forEach(gene => {
      var linkParts = gene.uniProtLink.split('/');

      if (linkParts[linkParts.length - 1] == "P33121"){
        obsList.push(this.afs.collection("Lmpd_Arapidopsis", ref => ref.where('uniprot_id', '==', "O22898").limit(1)).get());
      }

      else
        obsList.push(this.afs.collection("Lmpd_Arapidopsis", ref => ref.where('uniprot_id', '==', linkParts[linkParts.length - 1]).limit(1)).get());
    });

    return forkJoin(obsList);
  }
}
