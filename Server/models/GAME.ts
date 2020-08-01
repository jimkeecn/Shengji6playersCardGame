import { CardObject } from "./CARD";
import { USER } from "./USER";
export class RoundObject {
  collectedPoints: number = 0;
  userId: string = "";
  userName: string = "";
  roundCounts: number = 1;
}

export class GameObject {
  maxiumnPlayers: number = 6;
  isStarted: boolean = false;
  isReady: boolean = false;
  isShuffling: boolean = false;
  isSwaping: boolean = false;
  playerNumber: number = 0;
  shuffledCards: CardObject[] = [];
  trailCards: CardObject[] = [];
  roundInfo: RoundObject;
  currentPlayingLevel: number = 2;
  currentPlayingLeadPlayerId: string = "";
  currentPlayingLeadPlayerName: string = "";
  currentPlayers: USER[] = [];
  isInGame: boolean = false;
  callLead: CallLead;
  gameCounts: number;
}

export class CallLead {
  userId: string = "";
  userName: string = "";
  calledSuit: string = "";
  calledCards: CardObject[] = [];
}
