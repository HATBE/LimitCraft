import Card from './Card';

export default interface PlaygroundCard {
  card: Card;
  x: number;
  y: number;
  isLoading: boolean;
}
