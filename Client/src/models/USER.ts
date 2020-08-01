import { CardObject } from './CARD';

export class USER {
  id: string = '';
  username: string = '';
  currentDeck: CardObject[] = [];
  originalDeck: CardObject[] = [];
  currentRoundDeck: CardObject[] = [];
  lastRoundDeck: CardObject[] = [];
  isTurn: boolean = false;
  isLead: boolean = false;
  isSecondLead: boolean = false;
  level: number = 2;
  isAdmin: boolean = false;
}
