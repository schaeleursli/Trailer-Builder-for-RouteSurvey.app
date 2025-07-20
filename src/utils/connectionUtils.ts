import { ConnectionType } from '../types/trailer';
export function getConnectionIcon(type: ConnectionType): string {
  switch (type) {
    case 'gooseneck':
      return '🪝';
    // Hook emoji
    case 'towbar':
      return '🔗';
    // Chain link emoji
    case 'jeep_dolly':
      return '🚜';
    // Tractor emoji
    default:
      return '🔄';
    // Fallback
  }
}