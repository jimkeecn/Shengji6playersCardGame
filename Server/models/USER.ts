export class USER {
  id: string = "";
  username: string = "";
  currentDeck: any[] = [];
  originalDeck: any[] = [];
  currentRoundDeck: any[] = [];
  lastRoundDeck: any[] = [];
  isTurn: boolean = false;
  isLead: boolean = false;
  isSecondLead: boolean = false;
  level: number = 2;
  isAdmin: boolean = false;
}
