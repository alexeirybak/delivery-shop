import { Edit } from "lucide-react";
import { profileStyles } from "@/app/(auth)/styles";

interface EditButtonProps {
  onEdit: () => void;
}

const EditButton = ({ onEdit }: EditButtonProps) => {
  return (
    <button onClick={onEdit} className={profileStyles.editButton}>
      <Edit className="h-4 w-4 mr-1" />
      Редактировать
    </button>
  );
};

export default EditButton;