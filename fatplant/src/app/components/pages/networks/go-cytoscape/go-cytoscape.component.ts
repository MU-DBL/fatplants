import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { concat, forkJoin, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoints } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { CytographAdditionalData, ExtendableNode } from 'src/app/interfaces/cytograph-additional-data';
import * as nodeData from '../../../../assets/new_node.json';
import * as edgeData from '../../../../assets/new_edge.json';


@Injectable({
  providedIn:'root'
})  
@Component({
  selector: 'app-go-cytoscape',
  templateUrl: './go-cytoscape.component.html',
  styleUrls: ['./go-cytoscape.component.scss']
})
export class GoCytoscapeComponent implements OnInit {
  graphData = {
    nodes: [
    ],
    edges: [
    ]
  };
  node_description: any;



  constructor(private http: HttpClient){ }
  ELEMENT_DATA;
  showCyto = false;
  
    // we'll pass this onto the cytoscape network component
  experimentFilter:CytographAdditionalData = {kicExperimentId: "all"};
  
  ngOnInit(): void {
    this.getData();
    //console.log('nodedata',nodeData.data);
    
  }
  

  async getData() {
    // const nodeData$ = this.http.get('assets/new_node.json');
    // const edgeData$ = this.http.get('assets/new_edge.json');
    // let nested1, nested2; // declare variables here
    // console.log('check');

    // forkJoin([nodeData$, edgeData$]).subscribe(([nodeData, edgeData]) => {
    //   const x = [nodeData, edgeData];
    //   const c = this.mapEdgesNodes(x[0]['data'], x[1]['data']); //edge node details
    //   console.log(c);
    // });
    const x = [nodeData, edgeData];
    console.log('x',nodeData.data)
    const c = this.mapEdgesNodes(nodeData.data, edgeData.data); //edge node details
    console.log(c);
    
  }
  
  
  
      
  
    //p3db4-angular/src/app/pages/kicnetwork
    fetchJson(filename) {
      let headers = new HttpHeaders();
  
      const options: {
        headers?: HttpHeaders;
        observe?: 'body';
        params?: HttpParams;
        reportProgress?: boolean;
        responseType: 'json';
        withCredentials?: boolean;
      } = {
        responseType: 'json',
      };
  
  
      return this.http.get(filename, options).pipe(
        map((file) => {
          return file;
        })
      );
    }
  
    mapEdgesNodes(nodes, edges) {
      // let nodes, edges;
      console.log('nodes',nodes);
  
      for (let i = 0; i < nodes.length; i++) {
        // nodes[i]['name'] = nodes[i]['node_name'];
        nodes[i]['id'] = nodes[i]['tair_id'];
        // nodes[i]['Sayeera']=nodes[i]['sayeera']; if we want to add this field to entire nodes dataset
        nodes[i]['width'] = nodes[i]['substrate_count'] * 5 + 25;
  
        nodes[i].network_type = "kic";
        nodes[i] = { data: nodes[i] };
  
        
      }
      for (let i = 0; i < edges.length; i++) {
        edges[i]['source'] = edges[i]['Kinase'];
        edges[i].network_type = "kic";
        delete edges[i]['Kinase'];
        edges[i]['target'] = edges[i]['substrate'];
        edges[i]['width'] = Math.log2(edges[i].Phosphorylated_Percentage) + 1;
  
        
        delete edges[i]['substrate'];
  
        edges[i] = { data: edges[i], classes: 'tooltip' };
      }
      // cy.$('#edge').style('line-style', 'dashed');
      this.ELEMENT_DATA = {
  
  
        style: [
          {
            selector: 'node',
            css: {
               content: 'data(tair_id)',
              'border-color': '#99ccff',
              'border-opacity': 1,
              'border-width': '1px',
              'background-color': '#99ccff',
              // 'shape':'diamond',
            },
          },
          {
            selector: 'edge',
            css: {
              content:'data(Phosphorylated_Percentage)',
              width: 'data(width)',
              'target-arrow-shape': 'triangle',
              'line-color': '#401a4a',
              // 'line-style':'data(line_style)',
              // 'curve-style':'data(curve_style)',
              color: '#000000',
  
            },
  
          },
        ],
  
        elements: {
          nodes: nodes,
          edges: edges,
        },
  
      };
  
      console.log(this.ELEMENT_DATA)
      let family_list = {
        'Ser/Thr Protein Kinase Superfamily': '#ff0000',
        'AME/AFC Family': '#ff3399',
        'Casein Kinase Family': '#3366ff',
        'RLCK Family': '#00cc00',
        'CDPk Super Family': '#ff3399',
        'Lectin Receptor Kinase family': '#FFFF33'
      };
  
      let experiment_color_list = {
        'Nagib 2007(Thelen lab)': '#445941',
        'Nagib 2021(Thelen lab)': '#414259',
        'Gabriel 2024(Thelen lab&Stacy lab)': '#594141'
      };
  
      for (let e in experiment_color_list) {
        // for (let j = 1; j <= 100; j++) {
          this.ELEMENT_DATA.style.push({
            selector: `edge[Experiments_ID="${e}"]`,
            css: {
              'line-color': `${experiment_color_list[e]}`,
              // 'opacity': j / 100,
            },
          });
        // }
      }
  
      for (let e in family_list) {
        this.ELEMENT_DATA.style.push({
          selector: `node[family = "${e}" ]`,
          css: {
            content: 'data(tair_id)',
            'border-color': `${family_list[e]}`,
            'border-opacity': 1,
            width: 'data(width)',
            height: 'data(width)',
            'border-width': '1px',
            'background-color': `${family_list[e]}`,
          },
        });
      }
      console.log("Element Data is : ",this.ELEMENT_DATA);
      this.showCyto = true;
    }
  }
  
