import Card from './Card';

export default interface PlaygroundCard {
  localId: string;
  card: Card;
  x: number;
  y: number;
  isLoading: boolean;
}
