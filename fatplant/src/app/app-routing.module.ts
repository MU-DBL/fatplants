import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './components/pages/onestopsearch/data-analysis/data-analysis.component';
import { GlmolComponent } from './components/pages/tools/glmol/glmol.component';
import { ColorPathwayComponent } from './components/pages/tools/color-pathway/color-pathway.component';
import { BlastComponent } from './components/pages/tools/blast/blast.component';
import { GoNetworkComponent } from './components/pages/networks/go-network/go-network.component';
import { AngularFireAuthGuard } from '@angular/fire/auth-guard';

import { IntroductionComponent } from './components/pages/introductions/introduction/introduction.component';
import { InvestigatorComponent } from './components/pages/introductions/investigator/investigator.component';
import { InvestigatorNewComponent } from './components/pages/introductions/investigatorNew/investigatorNew.component';
import { GraphComponent } from './components/pages/networks/protein-network/graph.component';
// import { CytodemoComponent } from './cytodemo/cytodemo.component';
import { LmpddetailviewComponent } from './components/pages/datapages/lmpddetailview/lmpddetailview.component';
import { LmpdArapidopsisComponent } from './components/pages/datapages/lmpd-arapidopsis/lmpd-arapidopsis.component';
import { FattyacidComponent } from './components/pages/datapages/fattyacid/fattyacid.component';
import { CameliaComponent } from './components/pages/datapages/camelia/camelia/camelia.component';
import { UploadFilesComponent } from './components/pages/fileuploads/upload-files/upload-files.component';
import { FileviewComponent } from './components/pages/fileuploads/fileview/fileview.component';
import { SoybeanComponent } from './components/pages/datapages/soybean/soybean.component';
import { ShowresultsComponent } from './components/pages/onestopsearch/showresults/showresults.component';
import {LoginComponent} from './login/login.component';
import { UnifiedDatapageComponent } from './components/pages/datapages/unified-datapage/unified-datapage.component';
import { ProteinDetailComponent } from './components/pages/datapages/protein-detail/protein-detail.component';
import {AddNewsComponent} from './components/pages/add-news/add-news.component';
import { PathwayAralipsComponent } from "./components/pages/tools/pathway-aralips/pathway-aralips.component";
import { CustomPathwayComponent } from './components/pages/tools/custom-pathway/custom-pathway.component';
import { CustomPathwayListComponent } from './components/pages/tools/custom-pathway-list/custom-pathway-list/custom-pathway-list.component';
import { PathwayViewerComponent } from './components/pages/tools/pathway-viewer/pathway-viewer.component';
import { ProteinSoybeanComponent } from './components/pages/datapages/protein-soybean/protein-soybean.component';
import { ProteinCamelinaComponent } from './components/pages/datapages/protein-camelina/protein-camelina.component';
import { ExtendedPathwayComponent } from './components/pages/tools/extended-pathway/extended-pathway.component';
import { BlastInternalComponent } from './components/pages/tools/blast-internal/blast-internal.component';
import { HomeComponent } from './components/homecomponents/home/home.component';
import { ProteinDetailsNewComponent } from './components/pages/datapages/protein-details-new/protein-details-new.component';
// import {DatasetsNewComponent} from './components/pages/datapages/datasets-new/datasets-new.component';
import { NetworkComponent } from './components/go-network-page/network.component';
import { BlastPageComponent } from './components/blast-page/blast-page.component';
import { GlmolStructurePageComponent } from './components/glmol-structure-page/glmol-structure-page.component';
import { PathwayViewerPageComponent } from './components/pathway-viewer-page/pathway-viewer-page.component';
import { DataComponent } from './components/pages/Data_Page/data/data.component';
import {DatasetsNewComponent} from './components/pages/datapages/datasets-new/datasets-new.component';
import { ContactUsComponent } from './components/pages/contact/ContactUs.component';
import { GoCytoscapeComponent } from './components/pages/networks/go-cytoscape/go-cytoscape.component';

const routes: Routes = [{path: '', redirectTo: '/home', pathMatch: 'full'},
// {path: '', redirectTo: '/home', pathMatch: 'full'},
{path: 'homepage', component: HomepageComponent},
{path: 'login', component: LoginComponent},
{path: 'introduction', component: IntroductionComponent},
{path: 'investigator', component: InvestigatorComponent},
{path: 'team', component: InvestigatorNewComponent},
{path: 'lmpd_arapidopsis', component: LmpdArapidopsisComponent},
{path: 'glmol', component: GlmolComponent},
{path: 'color-pathway', component: ColorPathwayComponent},
{path: 'aralips-pathway', component: PathwayAralipsComponent},
{path: 'custom-pathway', component: CustomPathwayComponent},
{path: 'custom-pathway-list', component: CustomPathwayListComponent},
{path: 'camelina', component: CameliaComponent},
{path: 'fatty_acid', component: FattyacidComponent},
{path: 'protein-network', component: GraphComponent},
{path: 'go-network', component: GoNetworkComponent},
{path: 'one_click', component: DataAnalysisComponent},
{path: 'one_click/:uniprot_id/:cfg', component: DataAnalysisComponent},
{path: 'blast', component: BlastComponent},
{path: 'files', component:UploadFilesComponent, canActivate: [AngularFireAuthGuard]},
{path:'viewfiles',component:FileviewComponent},
{path: 'lmpddetailview/:uniprot_id', component: LmpddetailviewComponent},
{path: 'fatty_acid', component: FattyacidComponent},
{path: 'soybean', component: SoybeanComponent},
{path: 'add-news', component: AddNewsComponent},
// {path: 'data', redirectTo: '/data/arabidopsis', pathMatch: 'full'},
// {path: 'data/:dataset', component: DataComponent },
//{path: 'datasets/:dataset', component: UnifiedDatapageComponent}, //component: DatasetsNewComponent
{path: 'datasets', redirectTo: '/datasets/arabidopsis', pathMatch: 'full'},
{path: 'datasets/:dataset', component: DataComponent},
{path: 'showresults/:uniprot_id/:cfg', component: ShowresultsComponent},
{path: 'protein/:uniprot_id', component: ProteinDetailComponent},
{path: 'soybean_prot/:uniprot_id', component: ProteinSoybeanComponent}, 
{path: 'camelina_prot/:uniprot_id', component: ProteinCamelinaComponent},
{path: 'pathway-viewer', component: PathwayViewerComponent},
{path: 'extended-pathway', component: ExtendedPathwayComponent},
{path: 'blast-internal', component:BlastInternalComponent},
{path: 'home', component:HomeComponent},
//{path: '**', redirectTo: '/home'}],
{path: 'go-network-page', component:NetworkComponent},
{path: 'blast-page', component:BlastPageComponent},
{path: 'glmol-page', component:GlmolStructurePageComponent}, 
{path: 'pathway-viewer-page', component:PathwayViewerPageComponent}, 
{path: 'details/:database_name/:uniprot_id',component:ProteinDetailsNewComponent},
{path: 'contact', component: ContactUsComponent },
{path: 'go-cyto-network', component:GoCytoscapeComponent},
{path: '**', redirectTo: '/home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
