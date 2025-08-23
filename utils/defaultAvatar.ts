// utils/getAvatarPath.ts
export const getAvatarPath = (
  userOrGender: { avatar?: string; gender?: string } | null | undefined | string,
  gender?: string
) => {
  let avatar: string | undefined;
  let userGender: string | undefined;

  if (typeof userOrGender === 'string') {
    userGender = userOrGender;
  } else if (userOrGender && typeof userOrGender === 'object') {
    avatar = userOrGender.avatar;
    userGender = userOrGender.gender;
  }

  console.log('getAvatarPath debug:', {
    input: userOrGender,
    genderParam: gender,
    extractedAvatar: avatar,
    extractedGender: userGender,
    finalGender: userGender || gender || "male"
  });

  if (avatar) {
    return avatar;
  }

  const finalGender = userGender || gender || "male";
  
  return finalGender === "female" 
    ? "/images/graphics/default-avatars/female.png"
    : "/images/graphics/default-avatars/male.png";
};