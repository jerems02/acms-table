# ACMS Table

## Description

It's a component <acms-table></acms-table> used to display an UI table of data,
with pagination, search engine, and sortable capacities.
You just pass a json for data, and a config options.

## Installation

npm install git+https://github.com/jerems02/acms-table.git --save-dev

## Dependencies

* ng2-translate (be careful, it need to have a provider for ng2-translate else this component won't work, see importation)
* AcmsSwitch
* You need to import font-awesome in css to see icons

```html
<!-- example -->
<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/font-awesome/4.7.0/css/font-awesome.min.css">
```

## Importation

```typescript
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';

// Import your library
import { HttpModule, Http } from '@angular/http';
import { AcmsTableModule } from 'acms-table';
import { TranslateModule, TranslateLoader, TranslateStaticLoader } from "ng2-translate";

export function translateLoaderFactory(http: any) {
  return new TranslateStaticLoader(http, 'assets/translation', '.json');

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,

    // here it is
    AcmsTableModule,

    // important
    TranslateModule.forRoot({
        provide: TranslateLoader,
        seFactory: translateLoaderFactory,
        deps: [Http]
     }),
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
```

and in your component:

```typescript
<acms-table [collection]="collection" [config]="config" (rowSelected)="example($event)" (emptyTableEvt)="example($event)"></acms-table>
```

## Input

* collection : All your data in json format. For example :

```javascript
collection = [
    {
      "_id": "595a0f1a2ddc5ead84c90b9c",
      "guid": "8cdd8718-5c9f-49ad-b15f-6cefcb40d272",
      "isActive": false,
      "age": 32,
      "name": "Coleman Dunn",
      "gender": "male",
      "company": "GORGANIC",
      "email": "colemandunn@gorganic.com",
      "phone": "+1 (800) 443-2448",
      "favoriteFruit": "banana"
    },
    {
      "_id": "595a0f1a66b3c6c226eb59c7",
      "guid": "f877606a-acba-442f-b263-6def5e333932",
      "isActive": true,
      "age": 39,
      "name": "Chaney Mcleod",
      "gender": "male",
      "company": "EXTRAGENE",
      "email": "chaneymcleod@extragene.com",
      "favoriteFruit": "banana"
    },
    {
      "_id": "595a0f1ada3a0da3407b25de",
      "guid": "3936897e-dffd-41b3-999c-705c8bbea61e",
      "isActive": false,
      "age": 30,
      "name": "Rhodes Leach",
      "gender": "male",
      "company": "DUOFLEX",
      "email": "rhodesleach@duoflex.com",
      "favoriteFruit": "apple"
    }
];
```

* config : Here, you configure all the options, here's an example :

```javascript
config = {
    "global": {
          "showHeaders": true, // show the header <th> ?
          "legend": null, // you can put a string if you want a legend
          "isLegendTranslatable" : false, // true if you want a translation with ng2-translate
          "target_id": "guid", // path to the id row in data json, if not know it will be the table index (auto)
          "pagination": { // put this option if you want a pagination for your result
            "nbResultsByPage": 5,
            "type": "classic"
          },
          "placeHolderSearch": "Search...", // show a placeholder ?
          "isPlaceHolderSearchTranslatable": false, // true if you want a translation with ng2-translate
          "responsiveViewBreakPoint": 800, // breakPoint for 'hideWithResponsiveView' option
          "group_actions": ['delete'], // method available for group actions, null else
          "messageIfEmptyTable": "Sorry no result...", // message if there's no result
          "isMessageIfEmptyTableTranslatable": false // true if you want a translation with ng2-translate
    },
    "columns" : [
          {
            "title": "", // title in the header <th>
            "is_translatable": false, // true if you want a translation with ng2-translate for title
            "target": null, // no target for action cell
            "actions": ['select'], // select, update, delete
            "hideWithResponsiveView": false // hide this column if view smaller than breakpoint
          },
          {
            "title": "Name",
            "is_translatable": true,
            "target": "name", // path in json where we can find desired information (it could be nested)
            "is_sortable": true, // can we sort this column ?
            "is_searchable": true, // can we make a research with the results of this column ?
            "actions": null, // no action if data (target not null)
            "hideWithResponsiveView": false,
            "messageIfEmpty": "...", // message to display if empty value
            "isMessageIfEmptyTranslatable": false, // true if you want a translation with ng2-translate for message
          },
          {
            "title": "Age",
            "target": "age",
            "is_translatable": false,
            "is_sortable": true,
            "is_searchable": false,
            "actions": null,
            "hideWithResponsiveView": true
          },
          {
            "title": "Company",
            "target": "company",
            "is_translatable": false,
            "is_sortable": true,
            "is_searchable": true,
            "actions": null,
            "hideWithResponsiveView": false
          },
          {
            "title": "@Email",
            "target": "email",
            "is_translatable": false,
            "is_sortable": false,
            "is_searchable": true,
            "actions": null,
            "hideWithResponsiveView": false
          },
          {
            "title": "",
            "target": null, // actions column (no data expected here)
            "is_translatable": false,
            "actions": ['update', 'delete'],
            "hideWithResponsiveView": false
          }
    ]
}
```


## Output

* rowSelected : this event will sent when a action has been clicked, here is the sent object :

```javascript
{
    type: 'delete', // or update
    id: 123 // the id of the row (indicated by config.global.target_id)
}
```

* emptyTableEvt : an event sent each time the results change, it's a boolean that indicate if the table is empty or not

## License

© ACMS - [jerems02](mailto:jeremie.stezycki@sylpheo.com)