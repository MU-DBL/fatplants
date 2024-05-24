import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './header/header.component';
import { TableComponent } from './table/table.component';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './components/pages/onestopsearch/data-analysis/data-analysis.component';
import { NgCircleProgressModule } from 'ng-circle-progress';
import { ClipboardModule } from 'ngx-clipboard';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatListModule } from '@angular/material/list';
import { MatSelectModule } from '@angular/material/select';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { MatStepperModule } from '@angular/material/stepper';
import { MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatFormFieldModule} from '@angular/material/form-field';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatPaginatorModule} from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { CdkTableModule } from '@angular/cdk/table';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GraphComponent } from './components/pages/networks/protein-network/graph.component';
import {NgCytoComponent} from './components/pages/networks/ng-cyto/ng-cyto.component';
import {MatProgressSpinnerModule} from '@angular/material/progress-spinner';


// import { CytodemoComponent } from './cytodemo/cytodemo.component';
// import { CytoscapeModule } from 'ngx-cytoscape';
// import { GraphComponent } from './go-network/protein-network/protein-network.component';

//Firestore modules
import { environment } from '../environments/environment';
import { AngularFireModule } from 'angularfire2';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { GlmolComponent } from './components/pages/tools/glmol/glmol.component';
import { ColorPathwayComponent } from './components/pages/tools/color-pathway/color-pathway.component';
import { IntroductionComponent } from './components/pages/introductions/introduction/introduction.component';
import { InvestigatorComponent } from './components/pages/introductions/investigator/investigator.component';
import { InvestigatorNewComponent } from './components/pages/introductions/investigatorNew/investigatorNew.component';
import { DetailviewComponent } from './detailview/detailview.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import { AngularFireStorageModule } from '@angular/fire/storage';
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MatDividerModule} from "@angular/material/divider";
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import { AngularFireAuthGuardModule } from '@angular/fire/auth-guard';
import { AngularFireAuthModule } from '@angular/fire/auth';
import * as firebase from 'firebase';

firebase.initializeApp(environment.firebase);
import {MatProgressBarModule} from "@angular/material/progress-bar";
import { BlastComponent } from './components/pages/tools/blast/blast.component';
import { LmpddetailviewComponent } from './components/pages/datapages/lmpddetailview/lmpddetailview.component';
import { GoNetworkComponent } from './components/pages/networks/go-network/go-network.component';
import { LmpdArapidopsisComponent } from './components/pages/datapages/lmpd-arapidopsis/lmpd-arapidopsis.component';
import { DatatableComponent } from './components/pages/datapages/datatable/datatable.component';
import { CameliaComponent } from './components/pages/datapages/camelia/camelia/camelia.component';
import { FattyacidComponent } from './components/pages/datapages/fattyacid/fattyacid.component';
import { UploadFilesComponent } from './components/pages/fileuploads/upload-files/upload-files.component';
import { UploadTaskComponent } from './components/pages/fileuploads/upload-task/upload-task.component';
import { FileviewComponent } from './components/pages/fileuploads/fileview/fileview.component';
import { LmpdCardComponent } from './components/pages/datapages/lmpd-card/lmpd-card.component';
import { SoybeanComponent } from './components/pages/datapages/soybean/soybean.component';
import { ShowresultsComponent } from './components/pages/onestopsearch/showresults/showresults.component';
import {MatGridListModule} from "@angular/material/grid-list";
import {MatExpansionModule} from "@angular/material/expansion";
import {DataService} from 'src/app/services/data/data.service';
import { LoginComponent } from './login/login.component';
import { UnifiedDatapageComponent } from './components/pages/datapages/unified-datapage/unified-datapage.component';
import { StructureViewerComponent } from './components/pages/onestopsearch/structure-viewer/structure-viewer.component';
import { CdkDetailRowDirective } from './directives/cdk-detail-row.directive';
import { UserModalComponent } from './components/commons/user-modal/user-modal.component';
import { AddNewsComponent } from './components/pages/add-news/add-news.component';
import { ProteinDetailComponent } from './components/pages/datapages/protein-detail/protein-detail.component';
import { PathwayAralipsComponent } from './components/pages/tools/pathway-aralips/pathway-aralips.component';
import { CustomPathwayComponent } from './components/pages/tools/custom-pathway/custom-pathway.component';
import { CustomPathwayListComponent } from './components/pages/tools/custom-pathway-list/custom-pathway-list/custom-pathway-list.component';
import { CustomPathwayDialogComponent } from './components/pages/tools/custom-pathway-dialog/custom-pathway-dialog.component';
import { PathwayViewerComponent } from './components/pages/tools/pathway-viewer/pathway-viewer.component';
import { ProteinSoybeanComponent } from './components/pages/datapages/protein-soybean/protein-soybean.component';
import { ProteinCamelinaComponent } from './components/pages/datapages/protein-camelina/protein-camelina.component';
import { ExcludeListItemPipe, ExtendedPathwayComponent } from './components/pages/tools/extended-pathway/extended-pathway.component';
import { GptDialogComponent } from './components/commons/gpt-dialog/gpt-dialog.component';
import { BlastInternalComponent } from './components/pages/tools/blast-internal/blast-internal.component';
import { MenuComponent } from './components/homecomponents/menu/menu.component';
import { FooterComponent } from './components/homecomponents/footer/footer.component';
import { HomeComponent } from './components/homecomponents/home/home.component';
import { SearchComponent } from './components/homecomponents/search/search.component';
import { ProteinDetailsNewComponent } from './components/pages/datapages/protein-details-new/protein-details-new.component';
import { NetworkComponent } from './components/go-network-page/network.component';
import { GlmolStructurePageComponent } from './components/glmol-structure-page/glmol-structure-page.component';
import { PathwayViewerPageComponent } from './components/pathway-viewer-page/pathway-viewer-page.component';
import { BlastPageComponent } from './components/blast-page/blast-page.component';
import { CustomPathwayViewerComponent } from './components/pathway-viewer-page/custom-pathway-viewer/custom-pathway-viewer.component';
import { KeggPathwayViewerComponent } from './components/pathway-viewer-page/kegg-pathway-viewer/kegg-pathway-viewer.component';
import { ExtendedPathwayViewerComponent } from './components/pathway-viewer-page/extended-pathway-viewer/extended-pathway-viewer.component';
import { DataComponent } from './components/pages/Data_Page/data/data.component';
import { DatasetsNewComponent } from './components/pages/datapages/datasets-new/datasets-new.component';
import { GoCytoscapeComponent } from './components/pages/networks/go-cytoscape/go-cytoscape.component';
import { GoCytoscapeNetworkComponent } from './components/go-cytoscape-network/go-cytoscape-network.component';

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    TableComponent,
    LmpdArapidopsisComponent,
    HomepageComponent,
    DatatableComponent,
    GlmolComponent,
    ColorPathwayComponent,
    CameliaComponent,
    FattyacidComponent,
    GraphComponent,
    IntroductionComponent,
    InvestigatorComponent,
    InvestigatorNewComponent,
    BlastComponent,
    DetailviewComponent,
    NgCytoComponent,
    UploadFilesComponent,
    UploadTaskComponent,
    DropzoneDirective,
    FileviewComponent,
    LmpdCardComponent,
    LmpddetailviewComponent,
    GoNetworkComponent,
    LmpddetailviewComponent,
    SoybeanComponent,
    DataAnalysisComponent,
    LoginComponent,
    UnifiedDatapageComponent,
    DataAnalysisComponent,
    ShowresultsComponent,
    StructureViewerComponent,
    UserModalComponent,
    AddNewsComponent,
    CdkDetailRowDirective,
    AddNewsComponent,
    ProteinDetailComponent,
    PathwayAralipsComponent,
    CustomPathwayComponent,
    CustomPathwayListComponent,
    CustomPathwayDialogComponent,
    PathwayViewerComponent,
    ProteinSoybeanComponent,
    ProteinCamelinaComponent,
    ExtendedPathwayComponent,
    ExcludeListItemPipe,
    GptDialogComponent,
    BlastInternalComponent,
    MenuComponent,
    FooterComponent,
    HomeComponent,
    SearchComponent,
    ProteinDetailsNewComponent,
    NetworkComponent,
    GlmolStructurePageComponent,
    PathwayViewerPageComponent,
    BlastPageComponent,
    CustomPathwayViewerComponent,
    KeggPathwayViewerComponent,
    ExtendedPathwayViewerComponent,
    DataComponent,
    DatasetsNewComponent,
    GoCytoscapeComponent,
    GoCytoscapeNetworkComponent
  ],
  entryComponents: [
    StructureViewerComponent,
    UserModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    AngularFireModule.initializeApp(environment.firebase, 'fatplant'),
    AngularFirestoreModule,
    AngularFireStorageModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
    AngularFireAuthGuardModule,
    AngularFireAuthModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatPaginatorModule,
    MatSelectModule,
    MatMenuModule,
    MatTooltipModule,
    CdkTableModule,
    HttpClientModule,
    FormsModule,
    // CytoscapeModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatTabsModule,
    MatRadioModule,
    MatDividerModule,
    MatProgressBarModule,
    MatListModule,
    HttpClientModule,
    FormsModule,
    MatMenuModule,
    MatSidenavModule,
    MatButtonModule,
    MatSlideToggleModule,
    MatGridListModule,
    MatStepperModule,
    MatProgressSpinnerModule,
    NgCircleProgressModule.forRoot({
      // set defaults here
      radius: 100,
      outerStrokeWidth: 16,
      innerStrokeWidth: 8,
      outerStrokeColor: "#78C000",
      innerStrokeColor: "#C7E596",
      animationDuration: 300,
    }),
    MatExpansionModule,
    MatDialogModule,
    MatSnackBarModule,
    ClipboardModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
