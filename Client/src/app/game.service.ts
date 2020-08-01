import { Injectable } from '@angular/core';
import { Socket } from 'ngx-socket-io';
import { GAME } from 'src/models/GAME';
import { BehaviorSubject } from 'rxjs';
import { CardObject } from 'src/models/CARD';
import { USER } from 'src/models/USER';

@Injectable({
  providedIn: 'root',
})
export class GameService {
  gameInfo$ = new BehaviorSubject<GAME>(new GAME());
  userGuid$ = new BehaviorSubject<string>(null);
  myInfo$ = new BehaviorSubject<USER>(new USER());
  gameInfo = this.socket.fromEvent<GAME>('gameInfo');
  userGuid = this.socket.fromEvent<string>('userGuid');
  constructor(private socket: Socket) {
    let guid = localStorage.getItem('shengji6-userGuid');
    this.userGuid$.next(guid);
  }

  joinGame(text) {
    this.socket.emit('joinGame', text);
  }

  startShuffle() {
    this.socket.emit('startShuffle');
  }

  getGame() {
    this.socket.emit('getGame');
  }

  startSwap() {
    this.socket.emit('startSwapRound');
  }

  swapCard(data) {
    this.socket.emit('swapCard', data);
  }

  callLead(data: any) {
    this.socket.emit('callLead', data);
  }

  startGameRound() {
    this.socket.emit('startGameRound');
  }

  async sortDeck(deck: CardObject[]) {
    let suits = ['diamond', 'clubs', 'hearts', 'spades'];
    if (this.gameInfo$.value.callLead.calledSuit) {
      suits.splice(
        suits.findIndex((x) => x == this.gameInfo$.value.callLead.calledSuit),
        1
      );
    }

    let sortedDeck = [];
    let wild = await deck.filter((x) => x.suit == 'wild');
    let leadCards = await deck
      .sort((x) => parseInt(x.number))
      .filter(
        (x) =>
          parseInt(x.number) == this.gameInfo$.value.currentPlayingLevel &&
          x.suit !== 'wild'
      )
      .sort((a, b) => {
        if (a.suit > b.suit) {
          return 1;
        } else {
          return -1;
        }
      });
    let leadSuits = await deck
      .filter(
        (x) =>
          x.suit == this.gameInfo$.value.callLead?.calledSuit &&
          parseInt(x.number) !== this.gameInfo$.value.currentPlayingLevel
      )
      .sort((a, b) => {
        if (parseInt(a.number) > parseInt(b.number)) {
          return 1;
        } else {
          return -1;
        }
      });
    if (wild && wild.length > 0) {
      for (let x = 0; x < wild.length; x++) {
        await sortedDeck.push(wild[x]);
      }
    }

    if (leadCards && leadCards.length > 0) {
      for (let x = 0; x < leadCards.length; x++) {
        await sortedDeck.push(leadCards[x]);
      }
    }

    if (leadSuits && leadSuits.length > 0) {
      for (let x = 0; x < leadSuits.length; x++) {
        await sortedDeck.push(leadSuits[x]);
      }
    }

    for (let x = 0; x < suits.length; x++) {
      const name = suits[x];
      let filteredDeck = await deck
        .filter(
          (x) =>
            x.suit == name &&
            parseInt(x.number) !== this.gameInfo$.value.currentPlayingLevel
        )
        .sort((a, b) => {
          if (parseInt(a.number) > parseInt(b.number)) {
            return 1;
          } else {
            return -1;
          }
        });
      if (filteredDeck && filteredDeck.length > 0) {
        for (let y = 0; y < filteredDeck.length; y++) {
          await sortedDeck.push(filteredDeck[y]);
        }
      }
    }

    return sortedDeck;
  }
}
