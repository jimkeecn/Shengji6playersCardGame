import { Component, OnInit } from '@angular/core';
import { GameService } from '../game.service';
import { CardObject } from 'src/models/CARD';

@Component({
  selector: 'app-board',
  templateUrl: './board.component.html',
  styleUrls: ['./board.component.scss'],
})
export class BoardComponent implements OnInit {
  leadCards: CardObject[] = [];
  swapTrailedCards: CardObject[] = [];
  swapOwnedCards: CardObject[] = [];
  readySentCards: CardObject[] = [];
  calledSuit: string = '';
  constructor(public game: GameService) {}

  ngOnInit(): void {}

  cardAction(card: CardObject) {
    if (this.game.gameInfo$.value.isShuffling) {
      this.addLeadCard(card);
    }

    if (this.game.gameInfo$.value.isSwaping) {
      this.addToOwnedSwap(card);
    }

    if (
      this.game.gameInfo$.value.isStarted &&
      this.game.myInfo$.value.isTurn == true
    ) {
      this.pickCard(card);
    }
  }
  addLeadCard(card: CardObject) {
    if (
      parseInt(card.number) !== this.game.gameInfo$.value.currentPlayingLevel &&
      card.suit !== 'wild'
    ) {
      return;
    }

    if (this.leadCards.length == 0) {
      this.calledSuit = card.suit;
      this.leadCards.push(card);
      card.isLead = true;
    } else {
      if (card.suit !== this.leadCards[0].suit) {
        return;
      }

      if (card.suit == 'wild') {
        if (card.number !== this.leadCards[0].number) {
          return;
        }
      }

      const index = this.leadCards.findIndex((x) => x.id == card.id);
      if (index == -1) {
        this.leadCards.push(card);
        card.isLead = true;
      } else {
        return;
      }
    }

    console.log(this.leadCards);
  }

  addToOwnedSwap(card: CardObject) {
    if (this.swapOwnedCards.length == 0) {
      this.swapOwnedCards.push(card);
    } else {
      if (this.swapOwnedCards.length == 6) {
        return;
      }
      const index = this.swapOwnedCards.findIndex((x) => x.id == card.id);
      if (index !== -1) {
        return;
      } else {
        this.swapOwnedCards.push(card);
      }
    }

    const myinfo = { ...this.game.myInfo$.value };
    const index = myinfo.currentDeck.findIndex((x) => x.id == card.id);
    myinfo.currentDeck.splice(index, 1);
    this.game.myInfo$.next(myinfo);
  }

  removeOwnedSwap(card: CardObject) {
    const index = this.swapOwnedCards.findIndex((x) => x.id == card.id);
    this.swapOwnedCards.splice(index, 1);
    const myinfo = { ...this.game.myInfo$.value };
    myinfo.currentDeck.push(card);
    let deck = this.game.sortDeck(myinfo.currentDeck);
    deck.then((res) => {
      myinfo.currentDeck = res;
      this.game.myInfo$.next(myinfo);
    });
  }

  addToTrailSwap(card: CardObject) {
    if (this.swapTrailedCards.length == 0) {
      this.swapTrailedCards.push(card);
    } else {
      if (this.swapTrailedCards.length == 6) {
        return;
      }
      const index = this.swapTrailedCards.findIndex((x) => x.id == card.id);
      if (index !== -1) {
        return;
      } else {
        this.swapTrailedCards.push(card);
      }
    }

    const gameInfo = { ...this.game.gameInfo$.value };
    const index = gameInfo.trailCards.findIndex((x) => x.id == card.id);
    gameInfo.trailCards.splice(index, 1);
    this.game.gameInfo$.next(gameInfo);
  }

  removeTrailSwap(card: CardObject) {
    const index = this.swapTrailedCards.findIndex((x) => x.id == card.id);
    this.swapTrailedCards.splice(index, 1);
    const gameInfo = { ...this.game.gameInfo$.value };
    gameInfo.trailCards.push(card);
    this.game.gameInfo$.next(gameInfo);
  }

  callLead() {
    if (this.leadCards[0].suit == 'wild' && this.leadCards.length > 1) {
      if (
        this.leadCards.length >=
        this.game.gameInfo$.value.callLead.calledCards.length
      ) {
        const data = {
          userId: this.game.userGuid$.value,
          card: this.leadCards,
        };
        this.game.callLead(data);
      }
    } else {
      if (
        this.leadCards.length >
        this.game.gameInfo$.value.callLead.calledCards.length
      ) {
        const data = {
          userId: this.game.userGuid$.value,
          card: this.leadCards,
        };
        this.game.callLead(data);
      }
    }
  }

  swapCard() {
    if (this.swapTrailedCards.length + this.swapOwnedCards.length > 12) {
      alert('不许置换超过12张牌');
      return;
    }

    if (this.swapTrailedCards.length !== this.swapOwnedCards.length) {
      alert('置换不对等');
      return;
    }
    debugger;
    const data = {
      userId: this.game.myInfo$.value.id,
      added: this.swapTrailedCards,
      deleted: this.swapOwnedCards,
    };

    this.game.swapCard(data);
  }

  pickCard(card: CardObject) {
    const leadSuit = this.game.gameInfo$.value.callLead.calledSuit;
    const leadNumber = this.game.gameInfo$.value.currentPlayingLevel;
    const selfIndex = this.game.myInfo$.value.currentDeck.findIndex(
      (x) => x.id == card.id
    );
    if (this.readySentCards.length == 0) {
      this.readySentCards.push(card);
      this.game.myInfo$.value.currentDeck.splice(selfIndex, 1);
    } else {
      const firstSuit = this.readySentCards[0].suit;
      const firstNumber = this.readySentCards[0].number;
      if (
        firstSuit !== 'wild' &&
        firstSuit !== leadSuit &&
        parseInt(firstNumber) !== leadNumber
      ) {
        if (card.suit !== firstSuit || parseInt(card.number) == leadNumber) {
          alert('请选择同样花色');
          return;
        } else {
          this.readySentCards.push(card);
          this.game.myInfo$.value.currentDeck.splice(selfIndex, 1);
        }
      } else {
        if (
          card.suit !== 'wild' &&
          card.suit !== leadSuit &&
          parseInt(card.number) !== leadNumber
        ) {
          alert('请选择同样花色');
          return;
        } else {
          this.readySentCards.push(card);
          this.game.myInfo$.value.currentDeck.splice(selfIndex, 1);
        }
      }
    }
  }

  removeCard(card: CardObject) {
    const index = this.readySentCards.findIndex((x) => x.id == card.id);
    this.readySentCards.splice(index, 1);
    const myinfo = { ...this.game.myInfo$.value };
    myinfo.currentDeck.push(card);
    let deck = this.game.sortDeck(myinfo.currentDeck);
    deck.then((res) => {
      myinfo.currentDeck = res;
      this.game.myInfo$.next(myinfo);
    });
  }

  sendCard() {
    const data = {
      userId: this.game.myInfo$.value.id,
      cards: this.readySentCards,
    };
  }
  checkWhosTurn() {
    const user = this.game.gameInfo$.value.currentPlayers.find(
      (x) => x.isTurn == true
    );
    if (user) {
      return user.username;
    } else {
      return '';
    }
  }
}
