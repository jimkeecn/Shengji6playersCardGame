//npx ts-node src/foo.ts
import express = require("express");
import { CardObject } from "./models/CARD";
import { RoundObject, GameObject } from "./models/GAME";
import { USER } from "./models/USER";

import cards from "./json/cards.json";

import { v4 as uuidv4 } from "uuid";

const app = require("express")();
const http = require("http").Server(app);
const io = require("socket.io")(http);

console.log("service started");

const initGameCards: CardObject[] = giveIdToCards();

const game: GameObject = {
  maxiumnPlayers: 6,
  isStarted: false,
  isReady: false,
  playerNumber: 0,
  shuffledCards: [],
  trailCards: [],
  isShuffling: false,
  isSwaping: false,
  isInGame: false,
  gameCounts: 1,
  roundInfo: {
    collectedPoints: 0,
    userId: "",
    userName: "",
    roundCounts: 1,
  },
  currentPlayingLevel: 2,
  currentPlayingLeadPlayerId: "",
  currentPlayingLeadPlayerName: "",
  currentPlayers: [],
  callLead: {
    userId: "",
    userName: "",
    calledCards: [],
    calledSuit: "",
  },
};

io.on("connection", (socket: any) => {
  console.log("Sever is connected");
  socket.on("getGame", (data: any) => {
    socket.emit("gameInfo", game);
    io.emit("gameInfo", game);
  });

  socket.on("joinGame", (data: string) => {
    console.log("new player joined");
    if (game.isReady === false) {
      //Initiate a new user....
      let player = new USER().CreateNewUser(data);
      player.id = uuidv4();
      emitUserGuid(player.id);
      game.currentPlayers.push(player);
      game.playerNumber = game.currentPlayers.length;
      if (
        game.currentPlayers &&
        game.currentPlayers.length == game.maxiumnPlayers
      ) {
        game.isReady = true;
      }
    }
    emitGameInfo();
  });

  socket.on("startShuffle", (data: string) => {
    if (game.isReady == true) {
      //shuffle the current cards
      const shuffledcards = spliceShuffle(initGameCards);
      const trailCards = getTrailsCards(shuffledcards);
      const tobeSendCards = getTobeSentCards(shuffledcards);

      game.shuffledCards = tobeSendCards;
      game.trailCards = trailCards;

      shuffleCards();
    }
  });

  socket.on("callLead", (data: any) => {
    const userId: string = data.userId;
    const card: CardObject[] = data.card;
    if (game.isShuffling) {
      game.callLead.calledCards = card;
      game.callLead.calledSuit = card[0].suit;
      const userName = game.currentPlayers.find((x) => x.id == userId).username;
      game.callLead.userId = userId;
      game.callLead.userName = userName;
      if (game.gameCounts == 1) {
        game.currentPlayingLeadPlayerId = userId;
        game.currentPlayingLeadPlayerName = userName;
      }
      emitGameInfo();
    }
  });

  socket.on("startSwapRound", (data: any) => {
    if (game.isShuffling) {
      game.isShuffling = false;
      game.isSwaping = true;
      emitGameInfo();
    }
  });

  socket.on("swapCard", (data: any) => {
    const userId = data.userId;
    const added = data.added;
    const deleted = data.deleted;
    const playerIndex = game.currentPlayers.findIndex((x) => x.id == userId);
    if (deleted && deleted.length > 0) {
      deleted.forEach((x) => {
        game.currentPlayers[playerIndex].currentDeck.splice(
          game.currentPlayers[playerIndex].currentDeck.findIndex(
            (card) => card.id == x.id
          ),
          1
        );
      });
    }

    if (added && added.length > 0) {
      added.forEach((x) => {
        game.currentPlayers[playerIndex].currentDeck.push(x);
      });
    }
    game.isSwaping = false;
    game.isStarted = true;
    emitGameInfo();
  });

  socket.on("startGameRound", (data: any) => {
    game.isStarted = true;
    game.roundInfo.userId = game.currentPlayingLeadPlayerId;
    game.roundInfo.userName = game.currentPlayingLeadPlayerName;
    game.currentPlayers[
      game.currentPlayers.findIndex(
        (x) => x.id == game.currentPlayingLeadPlayerId
      )
    ].isTurn = true;
    emitGameInfo();
  });

  socket.on("sendCards", (data: any) => {
    const userId = data.userId;
    const cards = data.cards;
  });

  //Common functions

  async function sortCardsArray(cards: CardObject[]) {
    cards.sort((a, b) => {
      if (a.suit == "wild" && b.suit !== "wild") {
        return 1;
      }

      if (a.suit == "wild" && b.suit == "wild") {
        if (parseInt(a.number) > parseInt(b.number)) {
          return 1;
        } else {
          return -1;
        }
      }
    });
  }

  async function constructCardsArray(cards: CardObject[]) {
    if (cards.length == 1) {
      return cards;
    }

    if (cards.length > 1) {
    }
  }

  function shuffleCards() {
    game.isShuffling = true;
    console.log("shuffling....start");
    for (let number = 0; number < game.shuffledCards.length; number++) {
      setTimeout(() => {
        const playerIndex = (number + 6) % 6;
        game.currentPlayers[playerIndex].currentDeck.push(
          game.shuffledCards[number]
        );
        console.log(
          game.currentPlayers[playerIndex].username,
          game.shuffledCards[number]
        );
        emitGameInfo();
      }, number * 300);
    }
  }

  function emitGameInfo() {
    socket.emit("gameInfo", game);
    io.emit("gameInfo", game);
  }

  function emitUserGuid(guid) {
    socket.emit("userGuid", guid);
  }
});

http.listen(4444);

function giveIdToCards(): CardObject[] {
  let allcards: CardObject[] = cards;
  for (var x = 0; x < allcards.length; x++) {
    allcards[x].id = x + 1;
    allcards[x].isLead = false;
  }
  return allcards;
}

function spliceShuffle(cardsParam: CardObject[]) {
  let deck = [...cardsParam];
  let count = deck.length;
  let tempX;
  while (count) {
    tempX = deck.splice(Math.floor(Math.random() * count), 1);
    deck.splice(count, 0, tempX[0]);
    count -= 1;
  }
  return deck;
}

function getTrailsCards(shuffledCards: CardObject[]) {
  let deck = [...shuffledCards];
  let trailCards = [];
  for (let x = 1; x <= 6; x++) {
    trailCards.push(deck[deck.length - x]);
  }

  return trailCards;
}

function getTobeSentCards(shuffledCards: CardObject[]) {
  let deck = [...shuffledCards];
  for (let x = 1; x <= 6; x++) {
    deck.splice(deck.length - x, 1);
  }

  return deck;
}
