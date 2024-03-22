import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-network',
  templateUrl: './network.component.html',
  styleUrls: ['./network.component.scss']
})

export class NetworkComponent implements OnInit {
  visiable: boolean;
  filter: string;
  node_name: any;
  node_description: any;
  layout;
  style=[];
  graph: string;

  graphData = {
    nodes: [
    ],
    edges: [
    ]
  };
  constructor(private http: HttpClient) {
    this.graph = 'GO';
  }

  ngOnInit() {
    this.visiable = false;
    this.layout = {
      name: 'cose',
      idealEdgeLength: 100,
      nodeOverlap: 20,
      refresh: 20,
      fit: true,
      padding: 30,
      randomize: false,
      componentSpacing: 100,
      nodeRepulsion: 400000,
      edgeElasticity: 100,
      nestingFactor: 5,
      gravity: 80,
      numIter: 1000,
      initialTemp: 200,
      coolingFactor: 0.95,
      minTemp: 1.0
    };
    this.style = [
      {
        "selector": "core",
        "style": {
          "selection-box-color": "#AAD8FF",
          "selection-box-border-color": "#8BB0D0",
          "selection-box-opacity": "0.5"
        }
      }, {
        "selector": "node",
        "style": {
          "width": "mapData(hitCount, 0, 500, 20, 100)",
          "height": "mapData(hitCount, 0, 500, 20, 100)",
          "content": "data(name)",
          "font-size": "12px",
          "text-valign": "center",
          "text-halign": "center",
          "background-color": "#555",
          "text-outline-color": "#555",
          "text-outline-width": "2px",
          "color": "#fff",
          "overlay-padding": "6px",
          "z-index": "10"
        }
      },{
        "selector": "node[groupId=\"1\"]",
        "style": {
          "background-color": "#7d7070"
        }
      }, 
      {
        "selector": "node[groupId=\"2\"]",
        "style": {
          "background-color": "#7d7770"
        }
      },
      {
        "selector": "node[groupId=\"3\"]",
        "style": {
          "background-color": "#7d7d70"
        }
      },
      {
        "selector": "node[groupId=\"4\"]",
        "style": {
          "background-color": "#757d70"
        }
      },
      {
        "selector": "node[groupId=\"5\"]",
        "style": {
          "background-color": "#707d71"
        }
      },
      {
        "selector": "node[groupId=\"6\"]",
        "style": {
          "background-color": "#707d76"
        }
      },
      {
        "selector": "node[groupId=\"7\"]",
        "style": {
          "background-color": "#707d7a"
        }
      },
      {
        "selector": "node[groupId=\"8\"]",
        "style": {
          "background-color": "#707d7d"
        }
      },
      {
        "selector": "node[groupId=\"9\"]",
        "style": {
          "background-color": "#707a7d"
        }
      },
      {
        "selector": "node[groupId=\"10\"]",
        "style": {
          "background-color": "#70787d"
        }
      },
      {
        "selector": "node[groupId=\"11\"]",
        "style": {
          "background-color": "#70767d"
        }
      },
      {
        "selector": "node[groupId=\"12\"]",
        "style": {
          "background-color": "#70377d"
        }
      },
      {
        "selector": "node[groupId=\"13\"]",
        "style": {
          "background-color": "#72707d"
        }
      },
      {
        "selector": "node[groupId=\"14\"]",
        "style": {
          "background-color": "#75707d"
        }
      },
      {
        "selector": "node[groupId=\"15\"]",
        "style": {
          "background-color": "#77707d"
        }
      },
      {
        "selector": "node[groupId=\"16\"]",
        "style": {
          "background-color": "#7a707d"
        }
      },
      {
        "selector": "node[groupId=\"17\"]",
        "style": {
          "background-color": "#7c707d"
        }
      },
      {
        "selector": "node[groupId=\"18\"]",
        "style": {
          "background-color": "#7d707c"
        }
      },
      {
        "selector": "node[groupId=\"19\"]",
        "style": {
          "background-color": "#7d7079"
        }
      },
      {
        "selector": "node[groupId=\"20\"]",
        "style": {
          "background-color": "#7d7072"
        }
      },{
        "selector": "node[?attr]",
        "style": {
          "shape": "rectangle",
          "background-color": "#aaa",
          "text-outline-color": "#aaa",
          "width": "16px",
          "height": "16px",
          "font-size": "6px",
          "z-index": "1"
        }
      }, {
        "selector": "node[?query]",
        "style": {
          "background-clip": "none",
          "background-fit": "contain"
        }
      }, {
        "selector": "node:selected",
        "style": {
          "border-width": "6px",
          "border-color": "#AAD8FF",
          "border-opacity": "0.5",
          "background-color": "#77828C",
          "text-outline-color": "#77828C"
        }
      }, {
        "selector": "edge",
        "style": {
          "curve-style": "haystack",
          "haystack-radius": "0.5",
          "opacity": "0.4",
          "line-color": "#bbb",
          "width": "mapData(weight, 0, 1, 1, 8)",
          "overlay-padding": "3px"
        }
      }, {
        "selector": "node.unhighlighted",
        "style": {
          "opacity": "0.2"
        }
      }, {
        "selector": "edge.unhighlighted",
        "style": {
          "opacity": "0.05"
        }
      }, {
        "selector": ".highlighted",
        "style": {
          "z-index": "999999"
        }
      }, {
        "selector": "node.highlighted",
        "style": {
          "border-width": "6px",
          "border-color": "#AAD8FF",
          "border-opacity": "0.5",
          "background-color": "#394855",
          "text-outline-color": "#394855"
        }
      }, {
        "selector": "edge.filtered",
        "style": {
          "opacity": "0"
        }
      }, {
        "selector": "edge[group=\"1\"]",
        "style": {
          "line-color": "#d0b7d5"
        }
      }, {
        "selector": "edge[group=\"2\"]",
        "style": {
          "line-color": "#a0b3dc"
        }
      }, {
        "selector": "edge[group=\"3\"]",
        "style": {
          "line-color": "#90e190"
        }
      }, {
        "selector": "edge[group=\"4\"]",
        "style": {
          "line-color": "#9bd8de"
        }
      }, {
        "selector": "edge[group=\"5\"]",
        "style": {
          "line-color": "#eaa2a2"
        }
      }, {
        "selector": "edge[group=\"6\"]",
        "style": {
          "line-color": "#f6c384"
        }
      }, {
        "selector": "edge[group=\"7\"]",
        "style": {
          "line-color": "#dad4a2"
        }
      }, {
        "selector": "edge[group=\"8\"]",
        "style": {
          "line-color": "#D0D0D0"
        }
      }, {
        "selector": "edge[group=\"9\"]",
        "style": {
          "line-color": "#D0D0D0"
        }
      }, {
        "selector": "edge[group=\"10\"]",
        "style": {
          "line-color": "#D0D0D0"
        }
      }, {
        "selector": "edge[group=\"11\"]",
        "style": {
          "line-color": "#f0ec86"
        }
      }
    ];
    this.http.get('https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/godata').subscribe((res: any) => {
      //console.log(res);
      for (let item of res) {
        if (item.group === 'nodes') {
          this.graphData.nodes.push({data: item.data});
        }
        if (item.group === 'edges') {
          this.graphData.edges.push({data: item.data});
        }
      }
      //console.log(this.graphData);
      this.http.get('https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/gonodedescription').subscribe((res: any) => {
        //console.log(res);
        this.node_description = res;
        this.visiable = true;
      });
    });
  }
  
  nodeChange(event) {
    this.node_name = event;
  }
  filterClick(){
    if (this.filter.length > 0){
      this.visiable = false;
      //console.log(this.filter)
      this.http.get('https://us-central1-fatplantsmu-eb07c.cloudfunctions.net/godata?identifier='+ this.filter).subscribe((res: any) => {
        this.graphData = {
          nodes: [
          ],
          edges: [
          ]
        };
        //console.log(res);
        for (let item of res) {
          if (item.group === 'nodes') {
            this.graphData.nodes.push({data: item.data});
          }
          if (item.group === 'edges') {
            this.graphData.edges.push({data: item.data});
          }
        }
        //console.log(this.graphData);
        this.visiable = true;
      });
    }

  }
  layoutChange(type){
    this.visiable = false;
    switch (type) {
      case 'cose':
        this.layout = {
          name: 'cose',
          idealEdgeLength: 100,
          nodeOverlap: 20,
          refresh: 20,
          fit: true,
          padding: 30,
          randomize: false,
          componentSpacing: 100,
          nodeRepulsion: 400000,
          edgeElasticity: 100,
          nestingFactor: 5,
          gravity: 80,
          numIter: 1000,
          initialTemp: 200,
          coolingFactor: 0.95,
          minTemp: 1.0
        };
        this.style = [
          {
            "selector": "core",
            "style": {
              "selection-box-color": "#AAD8FF",
              "selection-box-border-color": "#8BB0D0",
              "selection-box-opacity": "0.5"
            }
          }, {
            "selector": "node",
            "style": {
              "width": "mapData(hitCount, 0, 500, 20, 100)",
              "height": "mapData(hitCount, 0, 500, 20, 100)",
              "content": "data(name)",
              "font-size": "12px",
              "text-valign": "center",
              "text-halign": "center",
              "background-color": "#555",
              "text-outline-color": "#555",
              "text-outline-width": "2px",
              "color": "#fff",
              "overlay-padding": "6px",
              "z-index": "10"
            }
          }, {
            "selector": "node[groupId=\"1\"]",
            "style": {
              "background-color": "#7d7070"
            }
          }, 
          {
            "selector": "node[groupId=\"2\"]",
            "style": {
              "background-color": "#7d7770"
            }
          },
          {
            "selector": "node[groupId=\"3\"]",
            "style": {
              "background-color": "#7d7d70"
            }
          },
          {
            "selector": "node[groupId=\"4\"]",
            "style": {
              "background-color": "#757d70"
            }
          },
          {
            "selector": "node[groupId=\"5\"]",
            "style": {
              "background-color": "#707d71"
            }
          },
          {
            "selector": "node[groupId=\"6\"]",
            "style": {
              "background-color": "#707d76"
            }
          },
          {
            "selector": "node[groupId=\"7\"]",
            "style": {
              "background-color": "#707d7a"
            }
          },
          {
            "selector": "node[groupId=\"8\"]",
            "style": {
              "background-color": "#707d7d"
            }
          },
          {
            "selector": "node[groupId=\"9\"]",
            "style": {
              "background-color": "#707a7d"
            }
          },
          {
            "selector": "node[groupId=\"10\"]",
            "style": {
              "background-color": "#70787d"
            }
          },
          {
            "selector": "node[groupId=\"11\"]",
            "style": {
              "background-color": "#70767d"
            }
          },
          {
            "selector": "node[groupId=\"12\"]",
            "style": {
              "background-color": "#70377d"
            }
          },
          {
            "selector": "node[groupId=\"13\"]",
            "style": {
              "background-color": "#72707d"
            }
          },
          {
            "selector": "node[groupId=\"14\"]",
            "style": {
              "background-color": "#75707d"
            }
          },
          {
            "selector": "node[groupId=\"15\"]",
            "style": {
              "background-color": "#77707d"
            }
          },
          {
            "selector": "node[groupId=\"16\"]",
            "style": {
              "background-color": "#7a707d"
            }
          },
          {
            "selector": "node[groupId=\"17\"]",
            "style": {
              "background-color": "#7c707d"
            }
          },
          {
            "selector": "node[groupId=\"18\"]",
            "style": {
              "background-color": "#7d707c"
            }
          },
          {
            "selector": "node[groupId=\"19\"]",
            "style": {
              "background-color": "#7d7079"
            }
          },
          {
            "selector": "node[groupId=\"20\"]",
            "style": {
              "background-color": "#7d7072"
            }
          },{
            "selector": "node[?attr]",
            "style": {
              "shape": "rectangle",
              "background-color": "#aaa",
              "text-outline-color": "#aaa",
              "width": "16px",
              "height": "16px",
              "font-size": "6px",
              "z-index": "1"
            }
          }, {
            "selector": "node[?query]",
            "style": {
              "background-clip": "none",
              "background-fit": "contain"
            }
          }, {
            "selector": "node:selected",
            "style": {
              "border-width": "6px",
              "border-color": "#AAD8FF",
              "border-opacity": "0.5",
              "background-color": "#77828C",
              "text-outline-color": "#77828C"
            }
          }, {
            "selector": "edge",
            "style": {
              "curve-style": "haystack",
              "haystack-radius": "0.5",
              "opacity": "0.4",
              "line-color": "#bbb",
              "width": "mapData(weight, 0, 1, 1, 8)",
              "overlay-padding": "3px"
            }
          }, {
            "selector": "node.unhighlighted",
            "style": {
              "opacity": "0.2"
            }
          }, {
            "selector": "edge.unhighlighted",
            "style": {
              "opacity": "0.05"
            }
          }, {
            "selector": ".highlighted",
            "style": {
              "z-index": "999999"
            }
          }, {
            "selector": "node.highlighted",
            "style": {
              "border-width": "6px",
              "border-color": "#AAD8FF",
              "border-opacity": "0.5",
              "background-color": "#394855",
              "text-outline-color": "#394855"
            }
          }, {
            "selector": "edge.filtered",
            "style": {
              "opacity": "0"
            }
          }, {
            "selector": "edge[group=\"1\"]",
            "style": {
              "line-color": "#d0b7d5"
            }
          }, {
            "selector": "edge[group=\"2\"]",
            "style": {
              "line-color": "#a0b3dc"
            }
          }, {
            "selector": "edge[group=\"3\"]",
            "style": {
              "line-color": "#90e190"
            }
          }, {
            "selector": "edge[group=\"4\"]",
            "style": {
              "line-color": "#9bd8de"
            }
          }, {
            "selector": "edge[group=\"5\"]",
            "style": {
              "line-color": "#eaa2a2"
            }
          }, {
            "selector": "edge[group=\"6\"]",
            "style": {
              "line-color": "#f6c384"
            }
          }, {
            "selector": "edge[group=\"7\"]",
            "style": {
              "line-color": "#dad4a2"
            }
          }, {
            "selector": "edge[group=\"8\"]",
            "style": {
              "line-color": "#D0D0D0"
            }
          }, {
            "selector": "edge[group=\"9\"]",
            "style": {
              "line-color": "#D0D0D0"
            }
          }, {
            "selector": "edge[group=\"10\"]",
            "style": {
              "line-color": "#D0D0D0"
            }
          }, {
            "selector": "edge[group=\"11\"]",
            "style": {
              "line-color": "#f0ec86"
            }
          }
        ];
        break;
      case 'cola':
        this.layout = {
          name: 'cola',
          maxSimulationTime: 3000,
        };
        break;
      case 'circle':
        this.layout = {
          name: 'circle',
        };
        break;
      case 'concentric':
        this.layout = {
          name: 'concentric',
        };
        break;
      case 'avsdf':
        this.layout = {
          name: 'avsdf',
          refresh: 30,
          fit: true,
          padding: 10,
          ungrabifyWhileSimulating: false,
          animate: 'end',
          animationDuration: 500,
          nodeSeparation: 60
        };
        break;
      default:
        break;

    }
    this.visiable = true;
  }

}
