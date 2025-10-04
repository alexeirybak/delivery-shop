import { profileStyles } from "@/app/styles";
import { Edit } from "lucide-react";

const EditButton = ({ onEdit }: { onEdit: () => void }) => {
  return (
    <button onClick={onEdit} className={profileStyles.editButton}>
      <Edit className="h-4 w-4 mr-1" />
      Редактировать
    </button>
  );
};

export default EditButton;
