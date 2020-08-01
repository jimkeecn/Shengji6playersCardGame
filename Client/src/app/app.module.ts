import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { SocketIoModule, SocketIoConfig } from 'ngx-socket-io';
import { environment } from '../environments/environment';
import { BoardComponent } from './board/board.component';
import { CardComponent } from './card/card.component';
const config: SocketIoConfig = { url: environment.url, options: {} };

@NgModule({
  declarations: [AppComponent, BoardComponent, CardComponent],
  imports: [BrowserModule, FormsModule, SocketIoModule.forRoot(config)],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
