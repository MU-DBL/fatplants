# Fatplants Developer Guide / Documentation

## Developer Setup 

Fatplants uses GitHub as a Version Control Manager (VCM) and to host the project code. The GitHub repository has the following main directories: 

    - Fatplant – The front end angular project, which follows the standard hierarchy. See: https://angular.io/guide/file-structure 
    - Server – Code for the backend server 
    - Firebase – Contains code for the various cloud functions we host on firebase 
    - Util – contains utility scripts (for example, the uniprot scraper which is also used to perform automated database updates) 

If not already, you should be familiar with git commands using the Command Line Interface (CLI) on your machine. Reference: https://education.github.com/git-cheat-sheet-education.pdf 

If you are running Windows, you should download Git Bash (https://gitforwindows.org/) to use Git commands, though you can also use the Command Prompt if more familiar to you. If you are running Mac OS / Linux, simply use your Terminal (bash). 

You will also need NodeJS and npm to run and install project dependencies: 

1. Download NodeJS for your system at: https://nodejs.org/en/download/ (for Windows, Node.js v12.22.12 is required, download at: https://nodejs.org/dist/v12.22.12/node-v12.22.12-x64.msi)

2. npm should be installed along with node; if not, you can download it here: https://docs.npmjs.com/downloading-and-installing-node-js-and-npm 

3. Note that NodeJS is a runtime library for server side JS. Npm is a package manager that installs nodejs packages, which form the basics of the Angular project and other software packages we use. 

4. In the fatplant directory, run `npm i` which installs all dependencies for the project. 

5. If you need to add a package to the project, run `npm I --save <package-name>`. If you only need this for development, use `--save-dev` instead. (npm reference: https://www.sitepoint.com/npm-guide/ )

   Note that these external packages are downloaded into node_modules which is ignored by git. Make sure to never check this directory in! Hint: you can add files/directories to the .gitignore file in order to automatically not track those files. This is good industry practice! 

6. Acquire your Firebase API keys and save them into the project folder. (See: setupEnvironments.md)

Once this is done and project dependencies are installed, you should have access to the Angular CLI (the ng command). To run a local development server, run ng serve (for Windows, go to "fatplants\fatplant" and run "node_modules\\.bin\ng serve"(Command Prompt) or ".\node_modules\\.bin\ng serve"(Powershell)). Then, you can access your development server on localhost:4200 in your web browser => whenever you update project files, this will recompile and reload the application. 

IDEs: Microsoft VS Code is a good free option, WebStorm is another good option for JS development.  

## Angular (fatplant)

As mentioned before, the project is based in Angular, which is a JavaScript framework that supports building Single Page Applications (SPAs). This results in an app-like website that is easier to code and follows the Model-View Controller architecture (MVC). The front end is constructed through templates, which consist of HTML/CSS, but with advanced functionality that allows dynamic changing of templates. Each component has a template, as well as a TypeScript file which contains the model and controller. TypeScript is a superset of javascript (all JS is valid TS), but typescript supports typing. Essentially, `variable: boolean` means the variable `variable` is of type `boolean`. Types can be primitives or defined interfaces. For example, the `Lmpd_Arapidopsis` type is an interface that represents a database entry for the arapidopsis species. You can find examples of this in `interfaces`.  

You should have a background in HTML/CSS/JavaScript development in order to understand Angular development. Being familiar with object-oriented design, MVC architecture, and more advanced JS utilities is a plus. You can reference the Angular docs, and also this document I compiled as part of my coursework: https://github.com/hudso1898/resources/blob/main/angular-journal-mhudson.pdf 

The structure of the project is as follows: 

The files in the root directory (fatplant) are mainly configuration files. Most importantly, package.json specifies project dependencies. You should not have to modify this file directly often; running npm i with –save will take care of this for you. 

The src directory is where the actual app content is in. The index.html file is what's loaded, and essentially bootstraps the application. 

In the static directory, you can place static assets (I.e. html files, images, etc.) that can be accessed directly using the URL. For example, if I place a file named test.png in static, I can reference this using href="/test.png". Note this is relative to the base of the DocumentRoot (the starting directory of web content). 

In the app directory, you can find the actual code for the project. The root component/module/routing_module can all be found here. The assets directory can contain any files you include in the component code. Most components are located in components (though some remain in the root directory) and are categorized by their function. In interfaces you can find interface (type) declarations as discussed earlier. In services you can find all the services for the application. Services are typescript components, but exist across the entire application and can be injected into any component for it to access. Think of these as background processes that are accessible across the entire application. 

If you need to create new content (components, services, etc.), use the Angular CLI! This is much easier than doing the generation yourself. For example, you can run ng generate component <name> or just ng g c <name> which will create that specific component for you. Make sure to run this in the right dierctory to maintain the organization of the application! 

## Google Firebase 

Fatplants uses Google Firebase for deployment, cloud functions, and database using Google Firestore. To access, log onto console.firebase.google.com then click on the fatplant-76987 project, which you should have received an invite to. There are 2 projects associated with Fatplants: 

**fatplant-76987** (master): Used for production deployment and hosting the database (shared between all versions), deployed at https://fatplants.net 

**fatplantdev** (dev): Used only for the dev server deployment at https://fatplantdev.web.app 

You will need the firebase cli to perform some operations including deployment. You can install it here: https://firebase.google.com/docs/cli 

Once installed, run `firebase login` to login to your Google account. This will enable you to access your firebase projects from the CLI. 

### Deploying (dev) 

1. In the Fatplants git repository you have checked out on your machine, switch to the dev branch. Make sure to run `git pull` to pull any changes from GitHub. 

2. In the project directory, run firebase use fatplantdev, which will use the appropriate firebase project. Note that you need to be logged in to run firebase commands successfully (see above) 

3. In the root directory of the fatplant Angular project (FatPlant-Firebase/fatplant), run `ng build`, which will compile the project and output the web files to dist. 

4. Once done, run `firebase deploy`, which will take the files in dist and upload them to the development server. You should see a number of files being hashed, and some files updating. Note that this will only upload changed files! If you don't see any files being uploaded, make sure you ran ng build! 

5. Check https://fatplantdev.web.app to make sure the deployment went as intended. You may have to open a private browser to clear a cached version of the website. 

### Deploying (master/prod) 

**BEFORE DEPLOYING!!**

Merge dev into staging, check with Prof. Wergeles and others to make sure the version looks good. You can run your local dev server using `ng serve` to ensure there aren't any major compile issues. 

After this, merge staging into master, then check locally using `ng serve` as before. 

1. In the Fatplants git repository you have checked out on your machine, switch to the master branch. Make sure to run `git pull` to pull any changes from GitHub. 

2. In the project directory, run firebase use fatplant-76987, which will use the appropriate firebase project. Note that you need to be logged in to run firebase commands successfully (see above) 

3. In the root directory of the fatplant Angular project (FatPlant-Firebase/fatplant), run `ng build --prod`, which will compile the project and output the web files to dist. Note that adding –prod will build the app for production; this is a stricter operation, and some items that were only warnings when building a development version can be treated as errors now. 

4. Once done, run `firebase deploy`, which will take the files in dist and upload them to the development server. You should see a number of files being hashed, and some files updating. Note that this will only upload changed files! If you don't see any files being uploaded, make sure you ran ng build! 

5. Check https://fatplants.net to make sure the deployment went as intended. You may have to open a private browser to clear a cached version of the website. 

### Google Cloud Functions

[ TODO ] (Other devs who wrote the cloud functions should complete this section)

### Google Firestore (database)

The Fatplants database is hosted on Google Firebase using *Firestore*. Since Angular is a Google project, Firebase/Firestore works nicely in the Angular project. Firebase uses a *NoSQL* based schema; instead of defining a definite schema, data is organized into *collections* (tables), which themselves contain a list of *documents* (entries). A *document* is, in practical terms, a JSON object. All the database operations use JSON, which works immensely well when integrating the DB with the frontend project and other JS tools.

Firebase is cloud hosted along with our server. **Our free tier limits the number of reads per day to 50K and number of writes/deletes per day to 20K each**. Keep this in mind when performing updates or writing queries to the db.

#### Collections

Below is a list of existing collections in the database and how they are structured:

**Camelina**: Documents in this collection represent data of protein species in the Camelina family. This data is used primarily in the Camelina section of the datapage.

Schema:

```typescript
{
    AGI: string, // AGI identifier
    Aralip_Pathways: string,
    Araport_link: string, // links to an external site www.araport.org
    Ath_description: string,
    Camelina: string,
    Evalue: string, // specifies a threshold of accuracy
    GO_Terms: string, // terms that specify terms relating to this species, separated by semicolons. To get this into a list of strings in JS, use terms.split(';')
    GO_slimterms: string, // also split by semicolons
    Homologs: string, // also split by semicolons
    Lipid_Gene_DB_Groups: string,
    Syntenic_sub_genome: string,
    TF_Family: string
}
```

**Fatty Acid**: Documents in this collection represent data of fatty acid chemical molecules, primarily used in the Fatty Acid section of the datapage.

Schema:

```typescript
{
    Datapoints: number,
    Delta-Notation: string,
    Formula: string, // chemical formula of the molecule
    Mass: number,
    OtherNames: string, // if more than one, separated by semicolons
    PhyloTree: string,
    SOFAID: string,
    SystematicName: string
}
```

**Files**: Stores metadata about files that can be accessed through the site's Files page. This data is protected only for authenticated users.

Schema:

```typescript
{
    fileName: string, // name of the file
    lab: string, // which lab this file is categorized under
    url: string // points to a URL which downloads the file
}
```

**Lmpd_Arapidopsis**: Arguably the most important collection, these documents represent protein species in the Arapidopsis family. This is the most extensive dataset we have and is featured through the datapage, one-stop-search page, and various tools.

```typescript
{
    accession: string[],
    alternativeNames: string[],
    created: string,
    dataset: string,
    entrez_gene_id: string,
    features: Array<{
        description: string,
        evidence: string, // but is just a number, or multiple numbers spaced out
        location: { // the location either has begin/end if the feature is of length > 1, or position if the feature is of length == 1
            begin?: {
                position: string // but is just a number
            },
            end?: {
                position: string // but is just a number
            },
            position?: {
                position: string // but is just a number
            }
        },
        type: string
    }>,
    gene_name: string,
    gene_symbol: string,
    goReferences Array<{
        id: string,
        property: Array<{
            type: string,
            value: string
        }>,
        type: string // usually GO
    }>,
    lmp_id: string,
    modified: string,
    mrna_id: string,
    name: string,
    primaryGeneName: string,
    protein_entry: string, // foreign key to Lmpd_Arapidopsis_Detail1
    protein_gi: string,
    protein_name: string,
    recommendedName: string,
    refseq_id: string,
    seqLength: string, // but is just a number
    sequence: string,
    species_long: string,
    subcellularLocations: Array<{
        subcellularLocation: Array<{
            location?: {
                #text: string,
                evidence: string // but is just a number, or multiple numbers spaced out
            }>,
            topology?: {
                #text: string,
                evidence: string // but is just a number, or multiple numbers spaced out
            }
        },
        type: string
    }>,
    tair_ids: string[], // can have 0, 1, or many
    taxid: string, // but is just a number
    uniprot_id: string, // this is used to uniquely identify this entry (primary key)
    version: string // but is just a number
}
```

**Lmpd_Arapidopsis_Detail1**: Contains protein detail information for each arapidopsis entry. The `protein_entry` field in `Lmpd_Arapidopsis_Detail1` is a foreign key to this collection (specified as just `entry` here).

Schema:

```typescript
{
    annotation: string,
    entry: string, // primary key, foreign key is protein_entry in Lmpd_Arapidopsis
    entry_name: string,
    "function": string,
    gene_names: string, // space delimited
    keywords: string, // semicolon delimited
    length: string, // but is really a number
    organism: string,
    protein_names: string,
    status: string, // reviewed or unreviewed
    subcellular_location: string
}
```

**Lmpd_Arapidopsis_Evidence**: Details related to details about arapidopsis entries (wherever `evidence` is specified in that document)

Schema:

```typescript
{
    details: string,
    end: string, // but is really a number
    evidence: string, // really a list, follows format <name>=<value> <name>=<value> ...
    start: string, // but is really a number
    term: string,
    uniprotID: string
```

**Lmpd_Arapidopsis_More**: Contains more details related to certain arapidopsis entries

Schema:

```typescript
{
    detail: string,
    end: string, // but is really a number
    start: string, // but is really a number
    type: string,
    uniprotID: string
}
```

**News**: Contains information about news items generated on the site

Schema:

```typescript
{
    img: string, // URL to the image for this item
    link: string, // links to the news item
    timestamp: timestamp, // time this item was created
    title: string
}
```

**Soybean**: The other major collection (along with Arapidopsis) for our dataset, which contains data about Soybean protein entries, and used in the same ways as Arapidopsis data.

Schema:

```typescript
{
    Alternativegenenames: string, // either "" or a single name
    Genenames: string,
    Length: string, // but is really a number
    ProteinEntry: string,
    Proteinnames: string,
    RefSeq: string, // list of ref seq references; this is also a semicolon delimited list
    Sequence: string,
    Species: string,
    UniprotID: string,
    name: string,
    names: string,
    // the following fields are present for some updated entries, not on others. Follows the same format as the previous Arapidopsis entries
    accession: string,
    created: string,
    dataset: string,
    features: Array<{
        description: string,
        evidence: string, // but is just a number, or multiple numbers spaced out
        location: { // the location either has begin/end if the feature is of length > 1, or position if the feature is of length == 1
            begin?: {
                position: string // but is just a number
            },
            end?: {
                position: string // but is just a number
            },
            position?: {
                position: string // but is just a number
            }
        },
        type: string
    }>,
    goReferences Array<{
        id: string,
        property: Array<{
            type: string,
            value: string
        }>,
        type: string // usually GO
    }>,
    modified: string,
    primaryGeneName: string,
    recommendedName: string,
    subcellularLocations: Array<{
        subcellularLocation: Array<{
            location?: {
                #text: string,
                evidence: string // but is just a number, or multiple numbers spaced out
            }>,
            topology?: {
                #text: string,
                evidence: string // but is just a number, or multiple numbers spaced out
            }
        },
        type: string
    }>,
    version: string // but is just a number
}
```

**users**: Metadata about the user accounts created in the application. Authentication is done through Firebase, so that data is **not** stored here.

Schema:

```typescript
{
    admin: number, // 0 indicates admin, 2 is normal user, 1 is intermediate privileges
    displayName: string,
    email: string,
    uid: string
}
```

#### Rules

The *Rules* section of Firebase management specifies how access is controlled to our collections and documents. If you receive errors on the Angular side that say 'Missing or Insufficient Permissions', this indicates these rules do not allow access to the requested collection/document. The rules should be set up to allow public read access only to the needed collections, and allow other operations if the user is authenticated to do so.

The Rules are specified through a JSON-like syntax with some JS-like conditional elements. You can find a history and examples of such rule specifications in the Firebase management console.