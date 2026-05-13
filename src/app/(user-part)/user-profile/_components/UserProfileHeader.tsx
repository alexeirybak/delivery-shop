import { useAuthStore } from "@/store/authStore";
import ProfileAvatar from "./ProfileAvatar";

const UserProfileHeader = () => {
  const { user } = useAuthStore();

  return (
    <div className="user-profile-header">
      <div className="user-profile-avatar-wrapper">
        <ProfileAvatar />
        <div className="user-profile-info">
          <h1 className="user-profile-name">{user?.name}</h1>
          <p className="user-profile-role">
            {user?.role === "admin"
              ? "Администратор"
              : user?.role === "manager"
                ? "Менеджер"
                : "Пользователь"}
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserProfileHeader;
