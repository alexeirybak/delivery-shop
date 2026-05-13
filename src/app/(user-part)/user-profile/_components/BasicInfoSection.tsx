import { MapPin, User } from "lucide-react";
import { statuses } from "@/app/auth/utils/statuses";
import ProfileEmail from "./ProfileEmail";
import ProfilePassword from "./ProfilePassword";
import EditableField from "./EditableField";

interface User {
  country: string | null;
  status: string | null;
  email: string;
  hasPassword: boolean;
}

interface BasicInfoSectionProps {
  user: User;
  onSave: (field: string, value: string) => Promise<void>;
}

export default function BasicInfoSection({ user, onSave }: BasicInfoSectionProps) {
  return (
    <div className="user-profile-section">
      <h2 className="user-profile-section-title">Основная информация</h2>
      <ProfileEmail />
      <ProfilePassword />

      <EditableField
        label="Страна"
        icon={<MapPin className="w-4 h-4" />}
        value={user.country}
        fieldName="country"
        placeholder="Россия"
        onSave={onSave}
      />

      <EditableField
        label="Статус"
        icon={<User className="w-4 h-4" />}
        value={user.status}
        fieldName="status"
        isSelect={true}
        selectOptions={statuses}
        onSave={onSave}
      />
    </div>
  );
}