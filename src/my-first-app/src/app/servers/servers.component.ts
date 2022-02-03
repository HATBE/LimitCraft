import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-servers',
  templateUrl: './servers.component.html',
  styleUrls: ['./servers.component.css']
})
export class ServersComponent implements OnInit {
  allowNewServer = false;
  serverCreationStatus = 'No Server was Created';
  servername = "";
  username = "";
  serverCreated=false;
  servers = ['TestServer', 'Testserver2'];

  clicks = [];
  msgDisabled=true;

  constructor() {
    setTimeout(() => {
      this.allowNewServer = true;
    }, 2000);
   }

  ngOnInit(): void {
  }

  onCreateServer() {
    this.serverCreated = true;
    this.servers.push(this.servername);
    this.serverCreationStatus = 'Server was created! Name: ' + this.servername;
  }

  onUpdateServerName(event: Event) {
    this.servername = (<HTMLInputElement>event.target).value;

  }

  resetUsername() {
    if(this.username != '') {
      this.username = '';
    }
  }

  toggleText() {
    if(this.msgDisabled) {
      this.msgDisabled = false;
    } else {
      this.msgDisabled = true;
    }

    this.clicks.push(Date.now);
  }
}
