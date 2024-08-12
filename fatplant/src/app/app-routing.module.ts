import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomepageComponent } from './homepage/homepage.component';
import { DataAnalysisComponent } from './components/pages/onestopsearch/data-analysis/data-analysis.component';
import { GlmolComponent } from './components/pages/tools/glmol/glmol.component';
import { ColorPathwayComponent } from './components/pages/tools/color-pathway/color-pathway.component';
import { BlastComponent } from './components/pages/tools/blast/blast.component';

import { TeamComponent } from './components/team-page/team.component';
import { GraphComponent } from './components/pages/networks/protein-network/graph.component';
import { LmpddetailviewComponent } from './components/pages/datapages/lmpddetailview/lmpddetailview.component';
import { LmpdArapidopsisComponent } from './components/pages/datapages/lmpd-arapidopsis/lmpd-arapidopsis.component';
import { FattyacidComponent } from './components/pages/datapages/fattyacid/fattyacid.component';
import { CameliaComponent } from './components/pages/datapages/camelia/camelia/camelia.component';
import { FileviewComponent } from './components/pages/fileuploads/fileview/fileview.component';
import { SoybeanComponent } from './components/pages/datapages/soybean/soybean.component';
import { ShowresultsComponent } from './components/pages/onestopsearch/showresults/showresults.component';
import { ProteinDetailComponent } from './components/pages/datapages/protein-detail/protein-detail.component';
import {AddNewsComponent} from './components/pages/add-news/add-news.component';
import { PathwayAralipsComponent } from "./components/pages/tools/pathway-aralips/pathway-aralips.component";
import { CustomPathwayComponent } from './components/custom-pathway-page/custom-pathway.component';
import { CustomPathwayListComponent } from './components/pages/tools/custom-pathway-list/custom-pathway-list/custom-pathway-list.component';
import { PathwayViewerComponent } from './components/pages/tools/pathway-viewer/pathway-viewer.component';
import { ProteinSoybeanComponent } from './components/pages/datapages/protein-soybean/protein-soybean.component';
import { ProteinCamelinaComponent } from './components/pages/datapages/protein-camelina/protein-camelina.component';
import { ExtendedPathwayComponent } from './components/pages/tools/extended-pathway/extended-pathway.component';
import { BlastInternalComponent } from './components/pages/tools/blast-internal/blast-internal.component';
import { HomeComponent } from './components/homecomponents/home/home.component';
import { ProteinDetailsPageComponent } from './components/protein-details-page/protein-details-page.component';
import { BlastPageComponent } from './components/blast-page/blast-page.component';
import { GlmolStructurePageComponent } from './components/glmol-structure-page/glmol-structure-page.component';
import { PathwayViewerPageComponent } from './components/pathway-viewer-page/pathway-viewer-page.component';
import { DataComponent } from './components/datasets-page/data.component';
import { ContactUsComponent } from './components/contact-page/contactus.component';
import { GoCytoscapeComponent } from './components/go-cytoscape-page/go-cytoscape.component';

const routes: Routes = [{path: '', redirectTo: '/home', pathMatch: 'full'},
{path: 'homepage', component: HomepageComponent},
{path: 'team', component: TeamComponent},
{path: 'lmpd_arapidopsis', component: LmpdArapidopsisComponent},
{path: 'glmol', component: GlmolComponent},
{path: 'color-pathway', component: ColorPathwayComponent},
{path: 'aralips-pathway', component: PathwayAralipsComponent},
{path: 'custom-pathway', component: CustomPathwayComponent},
{path: 'custom-pathway-list', component: CustomPathwayListComponent},
{path: 'camelina', component: CameliaComponent},
{path: 'fatty_acid', component: FattyacidComponent},
{path: 'protein-network', component: GraphComponent},

{path: 'one_click', component: DataAnalysisComponent},
{path: 'one_click/:uniprot_id/:cfg', component: DataAnalysisComponent},
{path: 'blast', component: BlastComponent},
{path:'viewfiles',component:FileviewComponent},
{path: 'lmpddetailview/:uniprot_id', component: LmpddetailviewComponent},
{path: 'fatty_acid', component: FattyacidComponent},
{path: 'soybean', component: SoybeanComponent},
{path: 'add-news', component: AddNewsComponent},
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
{path: 'go-network-page', component:GoCytoscapeComponent},
{path: 'blast-page', component:BlastPageComponent},
{path: 'glmol-page', component:GlmolStructurePageComponent}, 
{path: 'pathway-viewer-page', component:PathwayViewerPageComponent}, 
{path: 'details/:database_name/:uniprot_id',component:ProteinDetailsPageComponent},
{path: 'contact', component: ContactUsComponent },
{path: '**', redirectTo: '/home'}];

@NgModule({
  imports: [RouterModule.forRoot(routes,{ anchorScrolling: 'enabled'})],
  exports: [RouterModule]
})
export class AppRoutingModule { }
