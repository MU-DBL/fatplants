import { Component } from '@angular/core';

@Component({
  selector: 'app-contribution',
  templateUrl: './contribution.component.html',
  styleUrls: ['./contribution.component.css']
})
export class ContributionComponent {
  contributors = [
    {
      name: 'Sébastien Baud',
      image: '/app/assets/aralip_contributors/Sebasitien-Baud.jpg', 
      profile: 'http://www-ijpb.versailles.inra.fr/',
      email: 'sbaud@versailles.inra.fr',
      summary: 'Biotechnology scientist with broad experience in seed metabolic networks, transcriptional regulation of gene expression, and genetic engineering of Arabidopsis.'
    },
    {
      name: 'Mats Anderson',
      image: '/app/assets/aralip_contributors/Mats-Andersson.jpg',
      profile: 'http://www.dpes.gu.se/personal/larare_forskare/mats_andersson/',
      summary: 'Junior professor at the University of Gothenburg, Sweden, Plant biochemist with one foot in plant-pathogen interactions and the other in associations between the ER and the chloroplast envelope.'
    },
    {
      name: 'Amelie Kelly',
      image: '/app/assets/aralip_contributors/Amelie-Kelly.jpg', 
      profile: 'http://www2.warwick.ac.uk/fac/sci/whri/research/plantmetabolism/',
      network: 'http://www.linkedin.com/in/ameliekelly',
      summary: 'Plant Biochemist with interest in the (regulative) role of protein-lipid interactions during membrane biogenesis and oil breakdown.'
    },
    {
      name: 'Philip Bates',
      image: '/app/assets/aralip_contributors/Phil-Bates.jpg', 
      profile: 'http://scholar.google.com/citations?user=2teh5A8AAAAJ',
      network: 'http://www.linkedin.com/pub/philip-bates/17/988/881',
      email: 'phil_bates@wsu.edu',
      summary: 'Postdoctoral Research Associate of the Institute of Biological Chemistry at Washington State University, WA, USA. Extensive experience in plant lipid biochemistry pertaining to the synthesis of phospholipids and triacylglycerols.'
    },
    {
      name: 'Ikuo Nishida',
      image: '/app/assets/aralip_contributors/Ikuo-Nishida.jpg', 
      profile: 'http://athena.molbiol.saitama-u.ac.jp/molbiol/nishida-labo/English/index.htm',
      email: 'nishida@molbiol.saitama-u.ac.jp',
      summary: 'Professor, Department of Biochemistry and Molecular Biology, Graduate School of Science and Engineering, Saitama University, Japan. Plant Biologist with broad experience in lipid biochemistry and physiology.'
    },
    {
      name: 'Jonathan Markham',
      image: '/app/assets/aralip_contributors/Jonathan-Markham.jpg', 
      profile: 'http://www.danforthcenter.org/markham/',
      email: 'jmarkham@danforthcenter.org',
      summary: 'Research Scientist at the Donald Danforth Plant Science Center, Missouri, USA. Experienced in biology and analysis of sphingolipids from plants, algae, and fungi.'
    },
    {
      name: 'Kenta Katayama',
      image: '/app/assets/aralip_contributors/Kenta-Katayama.jpg', 
      profile: '',
      email: 'kenta@bio.c.u-tokyo.ac.jp',
      summary: 'Graduate Student at Department of Biological Sciences, Graduate School of Science, the University of Tokyo, Japan. Interested in genes involved in membrane lipids and the central roles of lipids in membrane dynamics.'
    },
    {
      name: 'Hajime Wada',
      image: '/app/assets/aralip_contributors/Hajime-Wada.jpg', 
      profile: '',
      email: 'hwada@bio.c.u-tokyo.ac.jp',
      summary: 'Professor at Department of Life Sciences, Graduate School of Arts and Sciences, The University of Tokyo, Japan. Research interest in lipid metabolism in photosynthetic organisms.'
    },
    {
      name: 'Tim Durrett',
      image: '/app/assets/aralip_contributors/Tim-Durrett.jpg', 
      profile: 'http://ohlroggelab.plantbiology.msu.edu/Lab_Pics/Durrett.htm',
      network: 'http://www.linkedin.com/in/timothydurrett',
      email: 'tdurrett@msu.edu',
      summary: 'Postdoctoral Fellow at Michigan State University. Extensive experience with lipid biochemistry, molecular biology, and plant genomics.'
    },
    {
      name: 'Xu Changcheng',
      image: '/app/assets/aralip_contributors/Xu-Changcheng.jpg', 
      profile: 'http://www.bnl.gov/biology/People/Xu.asp',
      email: 'cxu@bnl.gov',
      summary: 'Research scientist at Brookhaven National Laboratory, Upton, NY. Focused on the regulatory network governing lipid biosynthesis and storage.'
    },
    {
      name: 'David Bird',
      image: '/app/assets/aralip_contributors/David-Bird.jpg', 
      profile: 'http://research.mtroyal.ca/research.php?action=view&type=researchers&rid=1623/',
      network: 'http://www.biomedexperts.com/Profile.bme/1775754/David_Bird',
      email: 'dbird@mtroyal.ca',
      summary: 'Researcher in plant cell and molecular biology, focusing on the synthesis and secretion of surface lipids that make up the protective cuticle of the plant.'
    },
    {
      name: 'Owen Rowland',
      image: '/app/assets/aralip_contributors/Owen-Rowland.jpg', 
      profile: 'http://rowlandlab.blogspot.ca',
      network: 'http://www.linkedin.com/pub/owen-rowland/18/814/4a0',
      email: 'owen_rowland@carleton.ca',
      summary: 'Associate Professor in the Department of Biology and Institute of Biochemistry at Carleton University, Ottawa, Canada. Expertise in plant molecular biology, genomics, gene expression, genetic engineering, and microbiology.'
    },
    {
      name: 'Fred Beisson',
      image: '/app/assets/aralip_contributors/Fred-Beisson.jpg', 
      profile: 'http://www-dsv.cea.fr/en/sbvme',
      email: 'frederic.beisson@cea.fr',
      summary: 'Research scientist at the Department of Plant Biology and Environmental Microbiology, CEA-CNRS-Aix Marseille University, France. Focused on the discovery of proteins involved in the biosynthesis of extracellular lipids in plants.'
    },
    {
      name: 'Yonghua Li-Beisson',
      image: '/app/assets/aralip_contributors/Yonghua-Li.jpg',
      profile: 'http://www-dsv.cea.fr/',
      network: 'http://www-dsv.cea.fr/lb3m',
      email: 'yonghua.li@cea.fr',
      summary: 'Research scientist at CEA, Center de Cadarache, France. Interested in understanding genes and pathways underlying lipid metabolism in plants and microorganisms.'
    },
    {
      name: 'Rochus Franke',
      image: '/app/assets/aralip_contributors/Rochus-Franke.jpg', 
      profile: '',
      network: 'http://izmb.de/schreiber/index.en.shtml',
      email: 'rochus.franke@uni-bonn.de',
      summary: 'Permanent researcher at the Institute of Cellular and Molecular Botany at Bonn University, Bonn, Germany. Expertise in plant biochemistry, bioanalytics, and molecular genetics.'
    },
    {
      name: 'Isabel Molina',
      image: '/app/assets/aralip_contributors/Isabel-Molina.jpg', 
      profile: 'http://www.linkedin.com/in/isabelmolina',
      network: 'http://www.linkedin.com/in/isabelmolina',
      email: 'isabel.molina@gmail.com',
      summary: 'Plant Biochemist with strong background in lipid biochemistry, molecular biology, genomics, and cellular biology.'
    },
    {
      name: 'Vincent Arondel',
      image: '/app/assets/aralip_contributors/Vincent-Arondel.jpg', 
      profile: 'http://www.biomemb.cnrs.fr/',
      email: 'Vincent.arondel@u-bordeaux2.fr',
      summary: 'Researcher interested in plant lipid metabolism and triacylglycerol lipases.'
    },
    {
      name: 'Rémi ZALLOT',
      image: '/app/assets/aralip_contributors/Remi-Zallot.jpg', 
      profile: 'http://www.biomemb.cnrs.fr/',
      network: 'http://www.linkedin.com/pub/r%C3%A9mi-zallot/14/967/386',
      email: 'remi.zallot@gmail.com',
      summary: 'Ph.D. student at Biogenesis Membrane Laboratory working on lipases involved in Arabidopsis thaliana germination.'
    },
    {
      name: 'Ian Graham',
      image: '/app/assets/aralip_contributors/Ian-Graham.jpg', 
      profile: 'http://bioltfws1.york.ac.uk/biostaff/staffdetail.php?id=iag',
      email: 'iag1@york.ac.uk',
      summary: 'Research interests focus on the metabolic regulation of gene expression in higher plants and metabolic engineering of novel oils in oilcrops.'
    },
    {
      name: 'Kathy Schmid',
      image: '/app/assets/aralip_contributors/Kathy-Schmid.jpg', 
      profile: 'http://blue.butler.edu/~kschmid/',
      email: 'kschmid@butler.edu',
      summary: 'Educator interested in writing about many aspects of lipid biochemistry and molecular biology. Focuses on biosynthesis and properties of unusual fatty acids.'
    },
    {
      name: 'Martine Miquel',
      image: '/app/assets/aralip_contributors/Martine-Miquel.jpg', 
      profile: '',
      email: 'Miquel@versailles.inra.fr',
      summary: 'Research scientist at CNRS, INRA Versailles center, France. Focuses on lipid accumulation and oil body biogenesis during seed development using genetics and genomics.'
    },
    {
      name: 'Tony Larson',
      image: '/app/assets/aralip_contributors/Tony-Larson.png', 
      profile: 'http://www.york.ac.uk/org/cnap/',
      email: 'trl1@york.ac.uk',
      summary: 'Research scientist at CNAP, University of York, UK. Interested in analytical and data-mining techniques obtainable from mass-spectrometry of plant extracts.'
    },
    {
      name: 'Ruth Welti',
      image: '/app/assets/aralip_contributors/Ruth-Welti.jpg',
      profile: 'http://www.k-state.edu/biology/faculty_pages/welti.html',
      network: 'http://en.scientificcommons.org/ruth_welti',
      email: 'welti@ksu.edu',
      summary: 'Professor, Division of Biology, Kansas State University, USA. Biochemist with experience in lipid analysis, mass spectrometry, and their applications to plant biology.'
    },
    {
      name: 'Allan Debono',
      image: '/app/assets/aralip_contributors/Allan-Debono.jpg', 
      profile: 'http://samuelslab.blogspot.com/',
      network: 'http://ca.linkedin.com/in/allandebono',
      email: 'allan.debono@gmail.com',
      summary: 'Graduate student at the Department of Botany of the University of British Columbia, Canada. Research examines how lipid transfer proteins are involved in cuticular lipid export from epidermal cells.'
    },
    {
      name: 'Lacey Samuels',
      image: '/app/assets/aralip_contributors/Lacey-Samuels.jpg', 
      profile: 'http://www.botany.ubc.ca/people/lacey-samuels',
      email: 'lsamuels@mail.ubc.ca',
      summary: 'Research on how plant cells secrete their cell walls, including polysaccharides and specialized cell wall components such as lipids and lignin.'
    },
    {
      name: 'John Ohlrogge',
      image: '/app/assets/aralip_contributors/John-Ohlrogge.jpg', 
      profile: 'http://www.plantbiology.msu.edu/faculty/faculty-research/john-b-ohlrogge/',
      network: 'http://ohlroggelab.plantbiology.msu.edu/',
      email: 'Ohlrogge@msu.com',
      summary: 'Biochemist with experience in fatty acid synthesis, seed lipid metabolism, genomic strategies, and metabolic engineering.'
    },
    {
      name: 'Basil Shorrosh',
      image: '/app/assets/aralip_contributors/Basil-Shorrosh.jpg', 
      profile: 'http://bshorrosh.blogspot.com/',
      network: 'http://www.linkedin.com/in/bshorrosh',
      email: 'bshorrosh@gmail.com',
      summary: 'Biotechnology scientist experienced in plant genetic/metabolic engineering, molecular accelerated breeding, lipid biosynthesis, and software development.'
    }
  ];
}
