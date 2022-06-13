export class Card {
  id?: string;
  customerId?: string;
  customerName?: string;
  uid?: string;
  status?: number;
}
export class CardsResponse {
  statusCode?: number;
  message?: string;
  body!: Card[];
}

export class CardResponse {
  statusCode?: number;
  message?: string;
  body!: Card;
}
