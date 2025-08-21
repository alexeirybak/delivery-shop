import { AuthFormLayout } from "../../_components/AuthFormLayout";
import { CheckCircle } from "lucide-react";

const SuccessUpdatePass = () => {
  return (
    <AuthFormLayout>
      <div className="max-w-md mx-auto mt-10 p-6 text-center">
        <CheckCircle className="w-16 h-16 text-primary mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4 text-primary">
          Пароль успешно изменен!
        </h1>
        <p className="text-gray-600">
          Вы будете перенаправлены на страницу входа...
        </p>
      </div>
    </AuthFormLayout>
  );
};

export default SuccessUpdatePass;
