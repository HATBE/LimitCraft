import Card from './Card';

export default interface SidebarCard {
  localId: string;
  card: Card;
  lastX: number;
  lastY: number;
}
