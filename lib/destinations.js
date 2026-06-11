import { mockDestinations } from './mockData';

export function getDestinationMeta(id) {
  if (!id) return null;
  const key = id.toLowerCase();
  const found = mockDestinations.find((d) => d.id === key);
  if (found) return found;
  return {
    id: key,
    name: key.charAt(0).toUpperCase() + key.slice(1).replace(/-/g, ' '),
    country: '',
    image: 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?w=800',
    travelers: 0,
    description: 'Explore this destination with Kinovo travelers',
    tags: [],
  };
}

export function travelsToDestinations(travels) {
  const map = new Map();
  for (const travel of travels || []) {
    const id = travel.destinationId;
    if (!id) continue;
    const meta = getDestinationMeta(id);
    const existing = map.get(id);
    if (existing) {
      existing.travelCount += 1;
    } else {
      map.set(id, {
        ...meta,
        id,
        name: travel.destinationName || meta.name,
        image: travel.image || meta.image,
        travelCount: 1,
      });
    }
  }
  return Array.from(map.values());
}
