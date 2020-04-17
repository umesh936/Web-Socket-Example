import {Component} from '@angular/core';
import { Stomp} from 'stompjs/lib/stomp.js';
import * as SockJS from 'sockjs-client';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'app';

  greetings: string[] = [];
  showConversation = false;
  private stompClient;
  name: string;
  disabled: boolean;

  constructor() {
    this.connect();
  }

  // connect(){
  //   this.ws = new SockJS('http://localhost:12345/greeting');
  //   this.stompClient = Stomp.over(this.ws);
  //   let that = this;
  //   this.stompClient.connect({}, function(frame) {
  //     that.stompClient.subscribe("/chat", (message) => {
  //       if(message.body) {
  //         $(".chat").append("<div class='message'>"+message.body+"</div>")
  //         console.log(message.body);
  //       }
  //     });
  //   });
  // }
  connect() {
    const ws = new SockJS('http://localhost/greeting');
    this.stompClient = Stomp.over(ws);
    const that = this;
    this.stompClient.connect({}, function (frame) {
      that.stompClient.subscribe('/topic/reply', function (message) {
        console.log(message);
        that.showGreeting(message.body);
      });
      that.disabled = true;
    }, function (error) {
      alert('STOMP error ' + error);
    });
  }

  disconnect() {
    if (this.stompClient != null) {
      this.stompClient.close();
    }
    this.setConnected(false);
    console.log('Disconnected');
  }

  sendName(message: any, sendHandle?: any) {
    // tslint:disable-next-line:prefer-const
    var data = JSON.stringify({
      'name': this.name
    });
    this.stompClient.send('/app/message', {}, data);
  }

  showGreeting(message) {
    this.showConversation = true;
    this.greetings.push(message);
  }

  setConnected(connected) {
    this.disabled = connected;
    this.showConversation = connected;
    this.greetings = [];
  }
}
