import { Component, Injectable, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { concat, forkJoin, merge } from 'rxjs';
import { map } from 'rxjs/operators';
import { Breakpoints } from '@angular/cdk/layout';
import { environment } from 'src/environments/environment';
import { CytographAdditionalData, ExtendableNode } from 'src/app/interfaces/cytograph-additional-data';
import * as node_Data from '../../../../assets/cyto_node.json';
import * as edge_Data from '../../../../assets/cyto_edge.json';


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
  layout;
  style=[];
    // we'll pass this onto the cytoscape network component
  experimentFilter:CytographAdditionalData = {kicExperimentId: "all"};
  
  ngOnInit(): void {
    
    this.getData();
    //console.log('nodedata',nodeData.data);
    
  }
  

  async getData() {
    const x = [node_Data, edge_Data];
    console.log('x',node_Data.data)
    const c = this.mapEdgesNodes(node_Data.data, edge_Data.data); //edge node details
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
        nodes[i]['id'] = nodes[i]['Gene'];
        // nodes[i]['Sayeera']=nodes[i]['sayeera']; if we want to add this field to entire nodes dataset
        nodes[i]['width'] = nodes[i]['HitsCount'];
  
        nodes[i].network_type = "Direct";
        nodes[i] = { data: nodes[i] };
  
        
      }
      for (let i = 0; i < edges.length; i++) {
        edges[i]['source'] = edges[i]['node A'];
        edges[i].network_type = "Direct";
        delete edges[i]['node A'];
        edges[i]['target'] = edges[i]['node B'];
        edges[i]['width'] = 2;//Math.log2(edges[i].Phosphorylated_Percentage) + 1;
  
        
        delete edges[i]['node B'];
  
        edges[i] = { data: edges[i], classes: 'tooltip' };
      }
      // cy.$('#edge').style('line-style', 'dashed');
      this.ELEMENT_DATA = {
  
  
        style: [
          {
            selector: 'node[HitsCount <=40]',
            css: {
               content: 'data(Gene)',
              'border-color': '#f74f68',
              'border-opacity': 1,
              'border-width': '1px',
              'background-color': '#ff1a1a', //red
              'width': 'data(width)',
              'height':'data(width)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': '#000',
              'font-size': '15px',
              // 'shape':'diamond',
            },
          },
          {
            selector: 'node[HitsCount > 40][HitsCount <= 80]',
            css: {
               content: 'data(Gene)',
              'border-color': '#f74f68',
              'border-opacity': 1,
              'border-width': '1px',
              'background-color':'#ffff00', //yellow
              'width': 'data(width)',
              'height':'data(width)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': '#000',
              'font-size': '25px',
              // 'shape':'diamond',
            },
          },
          {
            selector: 'node[HitsCount > 80][HitsCount <= 120]',
            css: {
               content: 'data(Gene)',
              'border-color': '#f74f68',
              'border-opacity': 1,
              'border-width': '1px',
              'background-color': '#3333ff', //blue
              'width': 'data(width)',
              'height':'data(width)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': '#000',
              'font-size': '30px',
              // 'shape':'diamond',
            },
          },
          {
            selector: 'node[HitsCount > 120][HitsCount <= 150]',
            css: {
               content: 'data(Gene)',
              'border-color': '#f74f68',
              'border-opacity': 1,
              'border-width': '1px',
              'background-color': '#ff3399',  //pink
              'width': 'data(width)',
              'height':'data(width)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': '#000',
              'font-size': '40px',
              // 'shape':'diamond',
            },
          },
          {
            selector: 'node[HitsCount >= 150]',
            css: {
               content: 'data(Gene)',
              'border-color': '#f74f68',
              'border-opacity': 1,
              'border-width': '1px',
              'background-color': '#00ff00', //green
              'width': 'data(width)',
              'height':'data(width)',
              'text-valign': 'center',
              'text-halign': 'center',
              'color': '#000',
              'font-size': '50px',
              // 'shape':'diamond',
            },
          },
          {
            selector: 'edge',
            css: {
              content:'',
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
  
      // console.log(this.ELEMENT_DATA)
      // let family_list = {
      //   'Ser/Thr Protein Kinase Superfamily': '#ff0000',
      //   'AME/AFC Family': '#ff3399',
      //   'Casein Kinase Family': '#3366ff',
      //   'RLCK Family': '#00cc00',
      //   'CDPk Super Family': '#ff3399',
      //   'Lectin Receptor Kinase family': '#FFFF33'
      // };
  
      // let experiment_color_list = {
      //   'Nagib 2007(Thelen lab)': '#445941',
      //   'Nagib 2021(Thelen lab)': '#414259',
      //   'Gabriel 2024(Thelen lab&Stacy lab)': '#594141'
      // };
  
      // for (let e in experiment_color_list) {
      //   // for (let j = 1; j <= 100; j++) {
      //     this.ELEMENT_DATA.style.push({
      //       selector: `edge[Experiments_ID="${e}"]`,
      //       css: {
      //         'line-color': `${experiment_color_list[e]}`,
      //         // 'opacity': j / 100,
      //       },
      //     });
      //   // }
      // }
  
      // for (let e in family_list) {
      //   this.ELEMENT_DATA.style.push({
      //     selector: `node[family = "${e}" ]`,
      //     css: {
      //       content: 'data(tair_id)',
      //       'border-color': `${family_list[e]}`,
      //       'border-opacity': 1,
      //       width: 'data(width)',
      //       height: 'data(width)',
      //       'border-width': '1px',
      //       'background-color': `${family_list[e]}`,
      //     },
      //   });
      // }
      console.log("Element Data is : ",this.ELEMENT_DATA);
      this.showCyto = true;
    }
  }
  
