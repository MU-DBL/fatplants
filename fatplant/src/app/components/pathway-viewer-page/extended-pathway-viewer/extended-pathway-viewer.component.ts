import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-extended-pathway-viewer',
  templateUrl: './extended-pathway-viewer.component.html',
  styleUrls: ['./extended-pathway-viewer.component.scss']
})
export class ExtendedPathwayViewerComponent implements OnInit {

  constructor() { 
  }

  selectedLink = "/app/assets/pathwayImages/Cutin Synthesis & Transport 1.png";
  pathwayOptions = [{
    link: "/app/assets/pathwayImages/Cutin Synthesis & Transport 1.png",
    name: "Cutin Synthesis & Transport 1"
  },
  {
    link: "/app/assets/pathwayImages/Eukaryotic Galactolipid & Sulfolipid Synthesis.png",
    name: "Eukaryotic Galactolipid & Sulfolipid Synthesis"
  },
  {
    link: "/app/assets/pathwayImages/Fatty Acid Elongation, Desaturation & Export From Plastid.png",
    name: "Fatty Acid Elongation, Desaturation & Export From Plastid"
  },
  {
    link: "/app/assets/pathwayImages/Fatty Acid Synthesis.png",
    name: "Fatty Acid Synthesis"
  },
  {
    link: "/app/assets/pathwayImages/Oxylipin Metabolism 1.png",
    name: "Oxylipin Metabolism 1"
  },
  {
    link: "/app/assets/pathwayImages/Oxylipin Metabolism 2.png",
    name: "Oxylipin Metabolism 2"
  },
  {
    link: "/app/assets/pathwayImages/Phospholipid Signaling.png",
    name: "Phospholipid Signaling"
  },
  {
    link: "/app/assets/pathwayImages/Prokaryotic Galactolipid, Sulfolipid, & Phospholipid Synthesis 1.png",
    name: "Prokaryotic Galactolipid, Sulfolipid, & Phospholipid Synthesis 1"
  },
  {
    link: "/app/assets/pathwayImages/Prokaryotic Galactolipid, Sulfolipid, & Phospholipid Synthesis 2.png",
    name: "Prokaryotic Galactolipid, Sulfolipid, & Phospholipid Synthesis 2"
  },
  {
    link: "/app/assets/pathwayImages/Triacylglycerol & Fatty Acid Degradation.png",
    name: "Triacylglycerol & Fatty Acid Degradation"
  }
  ];

  // when the select input is changed
  onChange(newLink) {
    this.selectedLink = newLink;
  }

  ngOnInit(): void {

  }
}
