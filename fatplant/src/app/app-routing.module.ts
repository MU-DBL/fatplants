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

const routes: Routes = [{path: '', redirectTo: '/homepage', pathMatch: 'full'},
// {path: '', redirectTo: '/home', pathMatch: 'full'},
{path: 'homepage', component: HomepageComponent},
{path: 'login', component: LoginComponent},
{path: 'introduction', component: IntroductionComponent},
{path: 'investigator', component: InvestigatorComponent},
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
{path: 'datasets', redirectTo: '/datasets/arabidopsis', pathMatch: 'full'},
{path: 'datasets/:dataset', component: UnifiedDatapageComponent},
{path: 'showresults/:uniprot_id/:cfg', component: ShowresultsComponent},
{path: 'protein/:uniprot_id', component: ProteinDetailComponent},
{path: 'soybean_prot/:uniprot_id', component: ProteinSoybeanComponent},
{path: 'camelina_prot/:uniprot_id', component: ProteinCamelinaComponent},
{path: 'pathway-viewer', component: PathwayViewerComponent},
{path: 'extended-pathway', component: ExtendedPathwayComponent},
{path: 'blast-internal', component:BlastInternalComponent},
{path: 'home', component:HomeComponent},
// {path: '**', redirectTo: '/home'}];
{path: '**', redirectTo: '/homepage'}];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
