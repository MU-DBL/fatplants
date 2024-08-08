import { Component, OnInit } from '@angular/core';
import { Validators, FormBuilder, FormGroup } from '@angular/forms';
import { geneDict } from './gene_dictionary';
import { APIService } from 'src/app/services/api/api.service';
import { CustomPathwaysService }from '../../../../../services/custom-pathways/custom-pathways.service'

@Component({
  selector: 'app-custom-pathway-list',
  templateUrl: './custom-pathway-list.component.html',
  styleUrls: ['./custom-pathway-list.component.scss']
})
export class CustomPathwayListComponent implements OnInit {

  constructor(private apiService: APIService,
              private pathwayService: CustomPathwaysService,
              private formBuilder: FormBuilder) { }

  panelOpenState = false;
  dataSource = [];
  loading = true;
  displayedColumns = ["title", "paper", "link"];
  error: string = "";

  addPathwayForm: FormGroup;
  imgFile;
  coordFile;

  user: any = null;

  submitFiles() {
    this.error = "";
    this.loading = true;

    this.pathwayService.uploadPathwayImage(this.imgFile, this.imgFile.name).then(res => {
      res.ref.getDownloadURL().then(url => {
        let fileReader = new FileReader();
        let pathObject = {
          areas: [],
          imgPath: url,
          title: this.addPathwayForm.get("title").value,
          paper: this.addPathwayForm.get("paper").value
        };

        // setup reader function
        fileReader.onload = () => {
          var jsonObj = JSON.parse(fileReader.result as string);

          if (Array.isArray(jsonObj)) {
            for (var i = 1; i < jsonObj.length; i++) {
              var coords = jsonObj[i].coordinates[0]  + ',' + jsonObj[i].coordinates[1] + ',' + jsonObj[i].coordinates[2] + ',' + jsonObj[i].coordinates[3];
              var linkEnd = geneDict[jsonObj[i].gene_name.trim()];

              // if we don't get a result, try uppercase
              if (linkEnd == undefined) {
                linkEnd = geneDict[jsonObj[i].gene_name.toUpperCase()];

                if (linkEnd == undefined) // try adding a number if that doesnt work
                  linkEnd = geneDict[jsonObj[i].gene_name.toUpperCase() + '1'];

                if (linkEnd == undefined) // try adding a number if that doesnt work
                  linkEnd = geneDict[jsonObj[i].gene_name.toUpperCase() + '2'];
              }

              var documentObject = {
                shape: 'rect',
                coords: coords,
                uniProtLink: "https://www.uniprot.org/uniprot/" + linkEnd,
                fpLink: "https://www.fatplants.net/protein/" + linkEnd,
                title: jsonObj[i].gene_name
              };

              pathObject.areas.push(documentObject);
            }
          }
          else {
            throw("Could not parse the JSON file.");
          }

          // upload the parsed coordinates
          this.pathwayService.uploadPathwayCoords(pathObject).then(res => {
            this.loading = false;
            this.error = "Successfully uploaded " + this.addPathwayForm.get("title").value;
          })
          .catch(err => {
            // signal error and delete image
            this.loading = false;
            this.error = "There was a problem uploading the coordinate file. Please contact an administrator or try again later.";
            res.ref.delete();
          });
        }

        // start file processing then upload
        fileReader.readAsText(this.coordFile);
      })
      // catch clause for image upload
      .catch(err => {
        // signal error
        this.error = "There was a problem uploading the image. Make sure it is a valid image file or verify your connection.";
        this.loading = false;
      });
    });

    
  }

  deleteButton(pathwayId, imgSrc) {
    this.loading = true;
    this.pathwayService.deletePathway(pathwayId, imgSrc).then(() => {
      this.loading = false;
    })
  }

  onImageFileChange(event) {
    if (event.target.files.length > 0)
      this.imgFile = event.target.files[0];
  }

  onCoordFileChange(event) {
    if (event.target.files.length > 0)
      this.coordFile = event.target.files[0];
  }

  ngOnInit(): void {

    // verify that user is signed in
    // this.authService.checkUser().subscribe(res => {
    //   if (res !== null) {
    //     this.authService.findUser(res.email).subscribe(ret => {
    //       this.user = ret.docs[0].data();
    //       this.displayedColumns = ["title", "paper", "link", "actions"];
    //     });
    //   }
    //   else {
    //     this.user= null;
    //   }
    // });

    // construct form validation
    this.addPathwayForm = this.formBuilder.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      paper: ['', [
        Validators.required,
        Validators.minLength(3)
      ]],
      coordsFile: [null, [
        Validators.required
      ]],
      imgFile: [null, [
        Validators.required
      ]]
    });

    // populate graph
    this.apiService.getAllPathways().subscribe((pathways:any[]) => {
      this.dataSource = [];
      pathways.forEach(graph => {
        let graphAny: any = graph.payload.doc.data();

        this.dataSource.push({
          title: graphAny.title,
          paper: graphAny.paper,
          link: '/custom-pathway?id=' + graph.payload.doc.id,
          id: graph.payload.doc.id,
          imgPath: graphAny.imgPath
        });

        this.loading = false;
      });
    });
  }
}
