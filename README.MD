# ACMS Table

## Description

It's a component <acms-table></acms-table> used to display an UI table of data,
with pagination, search engine, and sortable capacities.
You just pass a json for data, and a config options.

## Installation

npm install git+https://github.com/jerems02/acms-table.git --save

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
      "gender": "male",
      "name": {
        "title": "mr",
        "first": "jordi",
        "last": "diez"
      },
      "location": {
        "street": "3597 calle de segovia",
        "city": "alcobendas",
        "state": "comunidad valenciana",
        "postcode": 36191
      },
      "email": "jordi.diez@example.com",
      "login": {
        "username": "orangecat654",
        "password": "bingo",
        "salt": "luhvXZEZ",
        "md5": "a8a02911242ed57c8e42d650b76eb973",
        "sha1": "e2a84bb60902e8abb38ee70a6c149cdc51ac8cc4",
        "sha256": "6639e27ff96448164b31eff7d7b178213b83ae346e6969b266938b78a97bc6d5"
      },
      "dob": "1976-05-14 06:01:41",
      "registered": "2007-06-28 16:11:42",
      "phone": "949-518-924",
      "cell": "653-983-474",
      "id": {
        "name": "DNI",
        "value": "43106111-P"
      },
      "picture": {
        "large": "https://randomuser.me/api/portraits/men/98.jpg",
        "medium": "https://randomuser.me/api/portraits/med/men/98.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/men/98.jpg"
      },
      "nat": "ES"
    },
    {
      "gender": "male",
      "name": {
        "title": "mr",
        "first": "ethan",
        "last": "hill"
      },
      "location": {
        "street": "5837 country club rd",
        "city": "rancho cucamonga",
        "state": "illinois",
        "postcode": 26466
      },
      "email": "ethan.hill@example.com",
      "login": {
        "username": "orangesnake630",
        "password": "stroke",
        "salt": "egDqtQSS",
        "md5": "a1dc84397c72af84d3e7d7e1004a562e",
        "sha1": "5ca47b62c812a5cd5da6239130c99ba5e15f08a3",
        "sha256": "0549da7f53fad7ec76d6dedd7af432732321337c5c3e18e9929f2f3f6d9899c5"
      },
      "dob": "1990-09-08 11:37:34",
      "registered": "2012-10-31 09:22:29",
      "phone": "(736)-974-8637",
      "cell": "(480)-114-9720",
      "id": {
        "name": "SSN",
        "value": "620-74-6508"
      },
      "picture": {
        "large": "https://randomuser.me/api/portraits/men/70.jpg",
        "medium": "https://randomuser.me/api/portraits/med/men/70.jpg",
        "thumbnail": "https://randomuser.me/api/portraits/thumb/men/70.jpg"
      },
      "nat": "US"
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
          "target_id": "id.value", // path to the id row in data json, if not know it will be the table index (auto)
          "pagination": { // put this option if you want a pagination for your result
            "nbResultsByPage": 5,
            "type": "classic"
          },
		  "search": ['First Name','Last Name', '@Email'], // title of columns which we search on
          "placeHolderSearch": "Search...", // show a placeholder ?
          "isPlaceHolderSearchTranslatable": false, // true if you want a translation with ng2-translate
          "searchLabel": 'Search: ', // label for search engine
          "isSearchLabelTranslatable": true, // true if you want a translation with ng2-translate
          "responsiveViewBreakPoint": 800, // breakPoint for 'hideWithResponsiveView' option
          "group_actions": ['delete'], // method available for group actions, null else
          "messageIfEmptyTable": "Sorry no result...", // message if there's no result
          "isMessageIfEmptyTableTranslatable": false // true if you want a translation with ng2-translate
    },
    "columns" : [
          {
            "title": "", // title in the header <th>
            "is_translatable": false, // true if you want a translation with ng2-translate for title (th) only
            "target": null, // no target for action cell
            "actions": ['select'], // select, update, delete
            "hideWithResponsiveView": false // hide this column if view smaller than breakpoint
          },
          {
            "title": "Name",
            "is_translatable": true,
            "target": "name.last", // path in json where we can find desired information (it could be nested)
            "is_sortable": true, // can we sort this column ?
            "is_searchable": true, // can we make a research with the results of this column ?
            "actions": null, // no action if data (target not null)
            "hideWithResponsiveView": false,
            "messageIfEmpty": "...", // message to display if empty value
            "isMessageIfEmptyTranslatable": false, // true if you want a translation with ng2-translate for message
          },
		  {
			"title": "Complete name",
			"concat": ['name.last', 'name.first'], // if we want a concatenation of several targets
			"is_translatable": false,
			"translatableRow" : false, // if we want to translate with ng2-translate the cell value (not the title th! like not 'is_translatable') 
			"is_sortable_by": 'gender', // if you are in multirows in the same cell, and you want to sort not by the main data but an other row (gender here)
			"is_searchable": true,
			"actions": null,
			"hideWithResponsiveView": false,
			"messageIfEmpty": "...",
			"isMessageIfEmptyTranslatable": true,
			"row" : { // if you want a value under the first row, for example, here display gender under complete name
				"target": "gender",
				"translatableRow": false,
				"messageIfEmpty": "...",
				"isMessageIfEmptyTranslatable": true
				}
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
			"translatableRow" : false,
            "is_sortable": true,
            "is_searchable": true,
            "actions": null,
            "hideWithResponsiveView": false
          },
		  {
			"title": "Profile",
			"target": 'picture.medium',
			"is_translatable": false,
			"is_sortable": false,
			"type": 'img', // if it's a image 
			"config": {
			  "type": 'large',
			  "height": '30', // you can precise a size
			  "default": null, // image by default
			  "method": this.autreTest, // we can precise a method to call if we click on the image
			  "context": this, // if you call a method, you have to precise the context (here this)
			  "params": ['one', 'two', 'three'] //the params for the method
			},
			"messageIfEmpty": "...",
			"isMessageIfEmptyTranslatable": false,
		  },
		  {
			"title": "SVG", // just an example with SVG
			"target": ' ',
			"type": 'svg', // if it's a SVG
			"is_translatable": false,
			"is_sortable": false,
			"messageIfEmpty": "<svg xmlns=\"http://www.w3.org/2000/svg\" width=\"24\" height=\"24\" viewBox=\"0 0 24 24\"> <g fill=\"none\" fill-rule=\"evenodd\"> <path fill=\"#FF2B45\" d=\"M11 17.3h2v-2h-2zM11 14h2V7h-2z\"/> <path stroke=\"#FF2B45\" stroke-width=\"2\" d=\"M15.728 3L21 8.272v7.456L15.728 21H8.272L3 15.728V8.272L8.272 3z\"/> </g> </svg>",
			isMessageIfEmptyTranslatable: false,
		},
		  {
			"title": "URL",
			"target": '', // here it's an example with a fix URL
			"is_translatable": false,
			"is_sortable": false,
			"type" : 'url', // if we want a link in the table
			"config": {
				"prefix": 'http', // if we want a prefix before the URL
				"target": '_blank', // _self, _parent
				"title": '', 
				"content": 'Click here', // the text in the link
				"isContentTranslatable": false
			},
			"messageIfEmpty": "site.com/help",
			"isMessageIfEmptyTranslatable": false,
			"classRow": 'my-class' // if we want to add a class in the td 
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
    type: 'delete', // or update or onRow
    id: 123 // the id of the row (indicated by config.global.target_id)
}
```

* emptyTableEvt : an event sent each time the results change, it's a boolean that indicate if the table is empty or not

## CSS

The table has no style. If you want to add styles on the table, you can use an external css stylesheet or add the rules in the host component with the /deep/ operator. For instance :

```css
/deep/ table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0 1px;
}

/deep/ table tr {
  background-color: #fff;
  height: 55px;
}

/*...*/

```

## License

© ACMS - [jerems02](mailto:jeremie.stezycki@sylpheo.com)

##  Change Log

v1.3.0

* Added translation on value not only on title
* Added ability to sort by other value in the multirows cell

v1.2.0

* Added an event when we click on the row
* Added ability to add image/svg/url
* Added abitity to add several line in the same td
* Added abitily to call a method when you click on a td

v1.1.0

* Fixed bug on search engine
* Added on main blocks containers
* Added ability to change search label with translation
