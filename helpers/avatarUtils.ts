// Funny avatar URLs from DiceBear API
export const FUNNY_AVATARS = [
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Felix',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Aneka',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Boots',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Cookie',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Duke',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Fluffy',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Gracie',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Hunter',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Jasper',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Kallie',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Leo',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Max',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Milo',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Murphy',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Oscar',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Paws',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pepper',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Pixie',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Rascal',
  'https://api.dicebear.com/7.x/fun-emoji/svg?seed=Rebel',
];

/**
 * Get a random funny avatar from the list
 */
export const getRandomFunnyAvatar = (): string => {
  const randomIndex = Math.floor(Math.random() * FUNNY_AVATARS.length);
  return FUNNY_AVATARS[randomIndex];
};

/**
 * Get avatar by user ID (consistent for same user)
 */
export const getAvatarByUserId = (userId: number | string): string => {
  const id = typeof userId === 'string' ? parseInt(userId, 10) : userId;
  const index = id % FUNNY_AVATARS.length;
  return FUNNY_AVATARS[index];
};
