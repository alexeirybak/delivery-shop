export const getAvatarByGender = (gender?: string): string => {
  switch (gender?.toLowerCase()) {
    case 'male':
      return '/images/graphics/defaultAvatars/male.png';
    case 'female':
      return '/images/graphics/defaultAvatars/female.png';
    default:
      return '/images/graphics/defaultAvatars/male.png';
  }
};