import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-card',
  templateUrl: './card.component.html',
  styleUrls: ['./card.component.scss'],
})
export class CardComponent implements OnInit {
  @Input() suit: string;
  _number: string;

  get getNumber() {
    return this._number;
  }
  @Input('number')
  set setNumber(number: string) {
    if (parseInt(number) >= 1 && parseInt(number) <= 10) {
      this._number = number;
    } else {
      if (number == '14') {
        this._number = 'A';
      }
      if (number == '11') {
        this._number = 'J';
      }
      if (number == '12') {
        this._number = 'Q';
      }
      if (number == '13') {
        this._number = 'K';
      }
    }
  }

  constructor() {}

  ngOnInit(): void {}

  getSrc(): string {
    if (this.suit) {
      return '/assets/img/cards/' + this.suit + '.png';
    } else {
      return '';
    }
  }

  getWildSrc(): string {
    if (this._number == '1') {
      return '/assets/img/cards/wild2.png';
    } else if (this._number == '2') {
      return '/assets/img/cards/wild1.png';
    } else {
      return '';
    }
  }
}
