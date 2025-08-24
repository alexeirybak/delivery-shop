export const getAvatarByGender = (gender?: string | null) => {
  return gender === "male"
    ? "/images/graphics/defaultAvatars/male.png"
    : "/images/graphics/defaultAvatars/female.png";
};
