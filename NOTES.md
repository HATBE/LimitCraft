# What is Angular

- Angular is a Framework to create Single-Page-Applications (SPAs)
- 1 html file and a lot of JS
- Refresh on Runtime

## What is Typescript

- Classes
- Types (String, Number, ...)
- Typescript -> Javascript (compiling)

## What is Angular vs Angular 2 vs Latest Angular

- Angular vs Angular 2 ->, totaly different framework
- Angular 1, Angular 2, Angular 4, ..., Angular 10, 11, 12, ..

- New Version every 6 months

## How does Angular work
index.html -> main.ts -> app.module.ts -> app.component.html/.ts

# Install

``` bash
$ sudo apt install nodejs
$ sudo apt install npm -y
$ sudo npm install -g @angular/cli
```

# Create a simple Project

``` bash
$ ng new <name> --no-strict

? Would you like to add Angular routing? (y/N) N

? Which stylesheet format would you like to use? CSS

$ ng serve
```

# Install Bootstrap

``` bash
npm install bootstrap
nano angular.json
change -> styles: ['node_modules/bootstrap/dist/css/bootstrap.min.css', 'src/style.css];
```

# Components
Application -> a bunch of Components
Each component is a part of the page, own html and css / js

## Manuel Create a Component

Create new subfolder `server` in src/app 
create server.component.ts and server.component.html

``` bash
$ nano server.component.ts

import { Component } from "@angular/core";

@Component({
    selector: 'app-server',
    templateUrl: './server.component.html'
})

export class ServerComponent {

}
```

``` bash
$ nano app-module.ts

[...]
import { ServerComponent } from './server/server.component';
[...]
@NgModule({
  declarations: [
    AppComponent,
    ServerComponent
  ],
[...]
```

## CLI Create a Component

``` bash
$ ng generate component <name>
```