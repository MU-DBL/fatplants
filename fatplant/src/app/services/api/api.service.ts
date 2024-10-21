import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class APIService {

  constructor(private http: HttpClient) { }

  //blast
  getblast(database: string, sequence:string, parameters: string){
    return this.http.get(environment.BASE_API_URL+"blast/?database="+database+"&sequence="+sequence+"&parameters="+parameters);
  }

  getPSIBlast(database: string, sequence:string, parameters: string){
    return this.http.get(environment.BASE_API_URL+"PSI_blast/?database="+database+"&sequence="+sequence+"&parameters="+parameters);
  }

  //pathways
  getAllPathways() {
    return this.http.get(environment.BASE_API_URL+"customized_pathways/");
  }

  getPathwayAreaById(pathway_id:string) {
    return this.http.get(environment.BASE_API_URL+"pathway_areas/?pathway_id="+pathway_id);
  }

  getPathwayImgById(pathway_id:string) {
    return this.http.get(environment.BASE_API_URL+"pathway_img_path/?pathway_id="+pathway_id);
  }

  getPathwaysByUniProt(species: string, uniprot_id: string) {
    return this.http.get(environment.BASE_API_URL+"pathways/?species="+species+"&uniprot_id="+uniprot_id);
  }

  getGeneInfoByProtId(Uniprotids) {
   return null;
  }

  searchSQLAPI(query: string, species: string) {
    return this.http.get(environment.BASE_API_URL+"get_species_records/?species="+ species +"&expression=" + query);
  }

  getDataSetSamples(species: string) {
    return this.http.get(environment.BASE_API_URL+"sample/?species="+species)
  }

  searchFattyAcid(query: string) {
    return this.http.get(environment.BASE_API_URL+"fatty_acid_search/?query=" + query);
  }

  searchSpeciesMapper(speciesName: string, q: string) {
    return this.http.get(environment.BASE_API_URL+"species_mapper/?speciesName=" + speciesName +"&q=" + q);
  }

  getDetailByUniprotid(speciesName: string, id: string) {
    return this.http.get(environment.BASE_API_URL+"details_uniprotid/?species=" + speciesName +"&id=" + id);
  }

  getBaseProteinFromUniProt(uniprot_id: string, species: string) {
    return this.http.get(environment.BASE_API_URL+"uniprot/?species="+ species +"&uniprot=" + uniprot_id);
  }

  getBaseProteinFromTair(species: string, tair: string) {
    return this.http.get(environment.BASE_API_URL+"tair/?species="+species+"&tair="+ tair);
  }

  getExtendedDetails(fp_id: string, species: string) {
    return this.http.get(environment.BASE_API_URL+"details/?species="+species+"&id="+fp_id);
  }

  getHomoLogs(uniprot_id: string) {
    return this.http.get(environment.BASE_API_URL+"homolog/?uniprot_id=" + uniprot_id);
  }

  askChatGPT(query: string) {
    return this.http.get(environment.BASE_API_URL+"chatgpt/?content=" + encodeURIComponent(query));
  }

  searchEnzyme(query: string) {
    return this.http.get(environment.BASE_API_URL+"enzyme_search/?query="+ query);
  }

  pathwayEnzyme(id: string) {
    return this.http.get(environment.BASE_API_URL+"enzyme_pathway/?id="+id);
  }
  
  pathwayAralip(id: string) {
    return this.http.get(environment.BASE_API_URL+"enzyme_pathway/?id="+id);
  }

  getEnzymeName(id: string) {
    return this.http.get(environment.BASE_API_URL+"enzyme/get_enzyme_name/?id="+id);
  }

  getEnzymeReaction(enzyme_id: string) {
    return this.http.get(environment.BASE_API_URL+"enzyme/get_enzyme_reactions/?enzyme_id="+enzyme_id);
  }

  getEnzymePathway(enzyme_id: string) {
    return this.http.get(environment.BASE_API_URL+"enzyme/get_enzyme_pathways/?enzyme_id="+enzyme_id);
  }

  getEnzymeLocus(enzyme_id: string) {
    return this.http.get(environment.BASE_API_URL+"enzyme/get_enzyme_locus/?enzyme_id="+enzyme_id);
  }

  submitComment(commentData: any) {
    return this.http.post(environment.BASE_API_URL + "submitform/", commentData);
  }

  get_location_summary(): Observable<any> {
    return this.http.get(environment.BASE_API_URL + 'locations_summary/');
  }

  get_enzyme_from_location_id(location_id: string) {
    return this.http.get(environment.BASE_API_URL + "enzyme_for_locus/?locus_id="+location_id);
  }
}
