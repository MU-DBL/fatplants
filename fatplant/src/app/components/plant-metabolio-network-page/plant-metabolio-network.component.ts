import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-plant-metabolio-network',
  templateUrl: './plant-metabolio-network.component.html',
  styleUrls: ['./plant-metabolio-network.component.scss']
})
export class PlantMetabolioNetworkComponent {
  dataset: string = 'aegilops_tauschii';  // 默认选中的数据集
  searchQuery: string = '';  // 搜索框内容

  ngOnInit(): void {
    this.loadWGpackage();
    this.changeDataset('glycolipid_desaturation');
  }

  changeDataset(newDataset: string) {
    this.dataset = newDataset;
    switch(newDataset){
      case "glycolipid_desaturation":{
        this.loadWGjson("pwy-782");
        break;
      }
      case "fatty_acid_biosynthesis_initiation":{
        this.loadWGjson("pwy-4381");
        break;
      }
      case "palmitate_biosynthesis_II":{
        this.loadWGjson("pwy-5971");
        break;
      }
      case "very_long_chain_fatty_acid_biosynthesis_II":{
        this.loadWGjson("pwy-7036");
        break;
      }
      case "fatty_acid_β-oxidation_III":{
        this.loadWGjson("pwy-5137");
        break;
      }
      case "fatty_acid_elongation":{
        this.loadWGjson("fasyn-elong-pwy");
        break;
      }
      case "tetradecanoate_biosynthesis":{
        this.loadWGjson("pwy66-430");
        break;
      }
      case "superpathway_of_fatty_acid_biosynthesis_II":{
        this.loadWGjson("pwy-5156");
        break;
      }
      case "fatty_acid_α-oxidation_I":{
        this.loadWGjson("pwy-2501");
        break;
      }
      case "phospholipid_desaturation":{
        this.loadWGjson("pwy-762");
        break;
      }
      case "long-chain_fatty_acid_activation":{
        this.loadWGjson("pwy-5143");
        break;
      }
      case "fatty_acid_β-oxidation_II":{
        this.loadWGjson("pwy-5136");
        break;
      }
      case "fatty_acid_β-oxidation_V":{
        this.loadWGjson("pwy-6837");
        break;
      }
      case "poly-very_long_chain_fatty_acid_biosynthesis_I":{
        this.loadWGjson("");
        break;
      }
      case "very_long_chain_fatty_acid_biosynthesis_I":{
        this.loadWGjson("pwy-5080");
        break;
      }
      case "fatty_acid_β-oxidation_IV":{
        this.loadWGjson("pwy-5138");
        break;
      }
      case "galactolipid_biosynthesis_I":{
        this.loadWGjson("pwy-401");
        break;
      }
      case "1D-myo-inositol_hexakisphosphate_biosynthesis_III":{
        this.loadWGjson("pwy-4661");
        break;
      }
      case "superpathway_of_phospholipid_biosynthesis_II":{
        this.loadWGjson("phoslipsyn2-pwy");
        break;
      }
      case "lipid-dependent_phytate_biosynthesis_I":{
        this.loadWGjson("pwy-4541");
        break;
      }
      case "phospholipid_remodeling":{
        this.loadWGjson("pwy-7409");
        break;
      }
      case "sphingolipid_biosynthesis":{
        this.loadWGjson("pwy-5129");
        break;
      }
      case "cholesterol_iosynthesis":{
        this.loadWGjson("pwy18c3-1");
        break;
      }
      case "sterol:steryl_ester_interconversion":{
        this.loadWGjson("pwy-7424");
        break;
      }
      case "phytosterol_biosynthesis ":{
        this.loadWGjson("pwy-2541");
        break;
      }
    }
  }

  onSearchChange(event: any) {
    this.searchQuery = event.target.value;
  }

  applySearchQuery() {
    console.log("Search Query Applied: ", this.searchQuery);
    // 可在这里添加后端 API 搜索逻辑
  }

  loadWGpackage() {
    const node = document.createElement('script');
    node.src = '/static/pmnwg/webgraphics.js';
    node.type = 'text/javascript';
    node.async = false;
    document.getElementsByTagName('body')[0].appendChild(node);
  }

  loadWGjson(digid: String) {
    const node = document.createElement('script');
    node.src = '/static/pmnwg/loadwg-'+digid+'.js';
    node.type = 'text/javascript';
    node.async = false;
    document.getElementsByTagName('body')[0].appendChild(node);
  }
}