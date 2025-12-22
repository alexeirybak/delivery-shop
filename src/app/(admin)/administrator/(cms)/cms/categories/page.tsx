"use client";

import { Header } from "../_components/Header";
import { SEORecommendations } from "../_components/SEORecommendations";
import { useCategoryFormState } from "../hooks/useCategoryFormState";
import { useCategoryFormValidation } from "../hooks/useCategoryFormValidation";
import { categorySeoRecommendations } from "../utils/recommendations";
import CategoryForm from "./_components/CategoryForm";
import CategoryTable from "./_components/CategoryTable";

const CategoriesPage = () => {
  const { formData, updateFormField, generateSlug } =
    useCategoryFormState();

  const { errors, validateForm } = useCategoryFormValidation();
  return (
    <div className="relative">
      <Header
        title="Управление категориями"
        description={`Всего категорий: ${"????"}`}
      />
      <CategoryForm
        formData={formData}
        errors={errors}
        onFieldChange={updateFormField}
        onGenerateSlug={generateSlug}
      />
      <CategoryTable />
      <SEORecommendations recommendations={categorySeoRecommendations} />
    </div>
  );
};

export default CategoriesPage;
