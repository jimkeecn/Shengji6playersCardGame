import { Component, OnInit } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GAME } from 'src/models/GAME';
import { BehaviorSubject } from 'rxjs';
import { tap } from 'rxjs/operators';
import { GameService } from './game.service';
import { CardObject } from 'src/models/CARD';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  text: string = '';
  constructor(public game: GameService) {}

  joinGame() {
    this.game.joinGame(this.text);
  }

  startShuffle() {
    this.game.startShuffle();
  }

  startSwap() {
    this.game.startSwap();
  }

  quitGame() {
    localStorage.removeItem('shengji6-userGuid');
    this.game.userGuid$.next(null);
  }

  startGameRound() {
    this.game.startGameRound();
  }

  ngOnInit() {
    this.game.getGame();
    this.game.gameInfo.subscribe((x) => {
      this.game.gameInfo$.next(x);
      if (x.currentPlayers && x.currentPlayers.length > 0) {
        let me = x.currentPlayers.find(
          (user) => user.id == this.game.userGuid$.value
        );

        let deck = this.game.sortDeck(me.currentDeck);
        deck.then((res) => {
          me.currentDeck = res;
          this.game.myInfo$.next(me);
        });
      }
    });
    this.game.userGuid.subscribe((x) => {
      console.log(x);
      localStorage.setItem('shengji6-userGuid', x);
      this.game.userGuid$.next(x);
    });
  }
}
