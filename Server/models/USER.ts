import { v4 as uuidv4 } from "uuid";

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

  CreateNewUser(usname: string) {
    this.id = uuidv4();
    this.username = usname;
    this.currentDeck = [];
    this.originalDeck = [];
    this.currentRoundDeck = [];
    this.lastRoundDeck = [];
    this.isTurn = false;
    this.isLead = false;
    this.isSecondLead = false;
    this.level = 2;
    if (usname.toLowerCase() == "junxi") {
      this.isAdmin = true;
    } else {
      this.isAdmin = false;
    }
  }
}
