export const getAvatarByGender = (gender: string) => {
  return gender === "male"
    ? "/images/graphics/defaultAvatars/male.png"
    : "/images/graphics/defaultAvatars/female.png";
};