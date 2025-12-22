import { FormFields } from "./FormFields";
import ImageSection from "./ImageSection";
import SubmitSection from "./SubmitSection";

const CategoryForm = ({ formData, errors, onFieldChange, onGenerateSlug }) => {
  const charCount: CharCount = {
    name: formData.name.length,
    slug: formData.slug.length,
    description: formData.description.length,
    keywords: formData.keywords.length,
    imageAlt: formData.imageAlt.length,
  };

  const handleInputChange = (
    field: FormField,
    value: string,
    maxLength: number
  ) => {
    if (value.length <= maxLength) {
      onFieldChange(field, value);
    }
  };

  const handleGenerateSlug = () => {
    onGenerateSlug();
  };

  return (
    <div className="mb-8 bg-white rounded shadow-sm p-6">
      <h2 className="text-xl font-semibold mb-4">Создание новой категории</h2>
      <form>
        <ImageSection />
        <FormFields
          formData={formData}
          errors={errors}
          onInputChange={handleInputChange}
          onGenerateSlug={handleGenerateSlug}
          charCount={charCount}
        />
        <SubmitSection />
      </form>
    </div>
  );
};

export default CategoryForm;
