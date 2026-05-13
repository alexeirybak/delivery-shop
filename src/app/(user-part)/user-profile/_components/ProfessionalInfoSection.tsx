import { Briefcase, Brain, Sparkles } from "lucide-react";
import EditableField from "./EditableField";

interface User {
  organization: string | null;
  specialization: string | null;
  interests: string | null;
}

interface ProfessionalInfoSectionProps {
  user: User;
  onSave: (field: string, value: string) => Promise<void>;
}

export default function ProfessionalInfoSection({ user, onSave }: ProfessionalInfoSectionProps) {
  return (
    <div className="user-profile-section">
      <h2 className="user-profile-section-title">Профессиональная информация</h2>

      <EditableField
        label="Организация"
        icon={<Briefcase className="w-4 h-4" />}
        value={user.organization}
        fieldName="organization"
        placeholder="Название организации"
        onSave={onSave}
      />

      <EditableField
        label="Специализация"
        icon={<Brain className="w-4 h-4" />}
        value={user.specialization}
        fieldName="specialization"
        placeholder="Например: Математика, Программирование"
        onSave={onSave}
      />

      <EditableField
        label="Интересы"
        icon={<Sparkles className="w-4 h-4" />}
        value={user.interests}
        fieldName="interests"
        placeholder="Нейросети, Педагогика, Data Science"
        onSave={onSave}
      />
    </div>
  );
}