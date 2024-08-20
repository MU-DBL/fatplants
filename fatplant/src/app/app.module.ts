import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import {HttpClientModule} from '@angular/common/http';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
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
import { MatSliderModule } from '@angular/material/slider'; 

import { GlmolComponent } from './components/pages/tools/glmol/glmol.component';
import { ColorPathwayComponent } from './components/pages/tools/color-pathway/color-pathway.component';
import { TeamComponent } from './components/team-page/team.component';
import { DropzoneDirective } from './directives/dropzone.directive';
import {MatTabsModule} from "@angular/material/tabs";
import {MatRadioModule} from "@angular/material/radio";
import {MatDividerModule} from "@angular/material/divider";

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
import {DataService} from 'src/app/services/blast_data/data.service';
import { UnifiedDatapageComponent } from './components/pages/datapages/unified-datapage/unified-datapage.component';
import { StructureViewerComponent } from './components/commons/structure-viewer/structure-viewer.component';
import { CdkDetailRowDirective } from './directives/cdk-detail-row.directive';
import { UserModalComponent } from './components/commons/user-modal/user-modal.component';
import { AddNewsComponent } from './components/pages/add-news/add-news.component';
import { ProteinDetailComponent } from './components/protein-details-summary-page/protein-detail.component';
import { PathwayAralipsComponent } from './components/pages/tools/pathway-aralips/pathway-aralips.component';
import { CustomPathwayComponent } from './components/custom-pathway-page/custom-pathway.component';
import { CustomPathwayListComponent } from './components/pages/tools/custom-pathway-list/custom-pathway-list/custom-pathway-list.component';
import { CustomPathwayDialogComponent } from './components/commons/custom-pathway-dialog/custom-pathway-dialog.component';
import { PathwayViewerComponent } from './components/pages/tools/pathway-viewer/pathway-viewer.component';
import { ProteinSoybeanComponent } from './components/protein-soybean-summary-page/protein-soybean.component';
import { ProteinCamelinaComponent } from './components/protein-camelina-summary-page/protein-camelina.component';
import { ExcludeListItemPipe, ExtendedPathwayComponent } from './components/pages/tools/extended-pathway/extended-pathway.component';
import { GptDialogComponent } from './components/commons/gpt-dialog/gpt-dialog.component';
import { BlastInternalComponent } from './components/pages/tools/blast-internal/blast-internal.component';
import { MenuComponent } from './components/home-page/menu/menu.component';
import { FooterComponent } from './components/home-page/footer/footer.component';
import { HomeComponent } from './components/home-page/home/home.component';
import { SearchComponent } from './components/home-page/search/search.component';
import { ProteinDetailsPageComponent } from './components/protein-details-page/protein-details-page.component';
import { GlmolStructurePageComponent } from './components/glmol-structure-page/glmol-structure-page.component';
import { PathwayViewerPageComponent } from './components/pathway-viewer-page/pathway-viewer-page.component';
import { BlastPageComponent } from './components/blast-page/blast-page.component';
import { CustomPathwayViewerComponent } from './components/pathway-viewer-page/custom-pathway-viewer/custom-pathway-viewer.component';
import { KeggPathwayViewerComponent } from './components/pathway-viewer-page/kegg-pathway-viewer/kegg-pathway-viewer.component';
import { ExtendedPathwayViewerComponent } from './components/pathway-viewer-page/extended-pathway-viewer/extended-pathway-viewer.component';
import { DataComponent } from './components/datasets-page/data.component';
import { GoCytoscapeComponent } from './components/go-cytoscape-page/go-cytoscape.component';
import { GoCytoscapeNetworkComponent } from './components/commons/go-cytoscape-network/go-cytoscape-network.component';
import { CounterComponent } from './components/home-page/counter/counter.component';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { ResearchPapersPageComponent } from './components/research-papers-page/research-papers-page.component';
import { LatestNewsPageComponent } from './components/latest-news-page/latest-news-page.component';


@NgModule({
  declarations: [
    AppComponent,
    LmpdArapidopsisComponent,
    DatatableComponent,
    GlmolComponent,
    ColorPathwayComponent,
    CameliaComponent,
    FattyacidComponent,
    GraphComponent,
    TeamComponent,
    BlastComponent,
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
    ProteinDetailsPageComponent,
    GlmolStructurePageComponent,
    PathwayViewerPageComponent,
    BlastPageComponent,
    CustomPathwayViewerComponent,
    KeggPathwayViewerComponent,
    ExtendedPathwayViewerComponent,
    DataComponent,
    GoCytoscapeComponent,
    GoCytoscapeNetworkComponent,
    CounterComponent,
    ResearchPapersPageComponent,
    LatestNewsPageComponent
  ],
  entryComponents: [
    StructureViewerComponent,
    UserModalComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    MatTableModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatAutocompleteModule,
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
    ClipboardModule,
    MatSliderModule 
  ],
  providers: [],
  bootstrap: [AppComponent]
})

export class AppModule { }
