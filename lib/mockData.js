export const mockDestinations = [
  {
    id: 'benidorm',
    name: 'Benidorm',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?w=800',
    travelers: 234,
    description: 'Vibrant beach town with amazing nightlife',
    tags: ['Beach', 'Nightlife', 'Social']
  },
  {
    id: 'tenerife',
    name: 'Tenerife',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800',
    travelers: 189,
    description: 'Island paradise with diverse experiences',
    tags: ['Island', 'Beach', 'Adventure']
  },
  {
    id: 'algarve',
    name: 'Algarve',
    country: 'Portugal',
    image: 'https://images.unsplash.com/photo-1553603227-2358aabe821e?w=800',
    travelers: 156,
    description: 'Stunning coastline and welcoming atmosphere',
    tags: ['Beach', 'Relaxed', 'Coastal']
  },
  {
    id: 'london',
    name: 'London',
    country: 'UK',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800',
    travelers: 312,
    description: 'World-class city with endless possibilities',
    tags: ['City', 'Culture', 'Nightlife']
  },
  {
    id: 'manchester',
    name: 'Manchester',
    country: 'UK',
    image: 'https://images.unsplash.com/photo-1594477915471-66b99c6dc7bf?w=800',
    travelers: 145,
    description: 'Music, culture and vibrant social scene',
    tags: ['City', 'Music', 'Social']
  },
  {
    id: 'ibiza',
    name: 'Ibiza',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1550593090-b915f85b93a4?w=800',
    travelers: 401,
    description: 'World-famous nightlife and beach culture',
    tags: ['Party', 'Beach', 'Music']
  },
  {
    id: 'gran-canaria',
    name: 'Gran Canaria',
    country: 'Spain',
    image: 'https://images.unsplash.com/photo-1607959992375-d7073e82a0ab?w=800',
    travelers: 178,
    description: 'Year-round sunshine and diverse landscapes',
    tags: ['Island', 'Beach', 'Sunny']
  }
];

export const mockTravelGroups = [
  {
    id: '1',
    destination: 'Ibiza',
    title: 'Summer Music Festival Weekend',
    date: '2025-07-15',
    members: 12,
    maxMembers: 20,
    image: 'https://images.unsplash.com/photo-1470229722913-7c0e2dbbafd3?w=800',
    description: 'Join us for an epic weekend of music and beach parties',
    tags: ['Music', 'Party', 'Beach']
  },
  {
    id: '2',
    destination: 'Tenerife',
    title: 'Hiking & Beach Exploration',
    date: '2025-06-20',
    members: 8,
    maxMembers: 15,
    image: 'https://images.unsplash.com/photo-1551632811-561732d1e306?w=800',
    description: 'Explore volcanic landscapes and hidden beaches',
    tags: ['Adventure', 'Nature', 'Social']
  },
  {
    id: '3',
    destination: 'London',
    title: 'Weekend Social Meetup',
    date: '2025-06-28',
    members: 15,
    maxMembers: 25,
    image: 'https://images.unsplash.com/photo-1533929736458-ca588d08c8be?w=800',
    description: 'Explore London nightlife with open-minded travelers',
    tags: ['City', 'Nightlife', 'Social']
  }
];

export const mockMessages = [
  {
    id: '1',
    userId: 'user2',
    userName: 'Sophie',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sophie',
    lastMessage: 'Looking forward to meeting up in Ibiza!',
    timestamp: '2m ago',
    unread: 2,
    online: true
  },
  {
    id: '2',
    userId: 'user3',
    userName: 'Marco',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Marco',
    lastMessage: 'The beach club was amazing yesterday',
    timestamp: '1h ago',
    unread: 0,
    online: false
  },
  {
    id: '3',
    userId: 'user4',
    userName: 'Emma',
    userAvatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Emma',
    lastMessage: 'Want to join us for dinner tonight?',
    timestamp: '3h ago',
    unread: 1,
    online: true
  }
];

export const mockUser = {
  id: 'user1',
  name: 'Alex Rivera',
  email: 'alex@example.com',
  avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex',
  bio: 'Open-minded traveler exploring the world 🌍',
  verified: true,
  trustScore: 4.8,
  languages: ['English', 'Spanish', 'French'],
  interests: ['Travel', 'Music', 'Beach', 'Nightlife', 'Culture'],
  location: 'London, UK',
  memberSince: '2024',
  isPremium: false
};
