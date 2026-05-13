"use client";

import Link from "next/link";
import { useEffect, useState, useCallback, useRef } from "react";
import { ChevronLeft } from "lucide-react";
import { Header } from "./Header";
import { Notification } from "../../workbook/_components/Notification";
import { useSearchParams, useRouter } from "next/navigation";
import { RecordForm } from "./RecordForm";
import { useRecordStore } from "@/store/recordStore";
import { useRecords } from "../hooks/useRecords";
import { useRecordFormState } from "../hooks/useRecordFormState";
import { CyberLoader } from "../../../_components/CyberLoader";
import { useCategoryStore } from "@/store/categoryStore";
import { loadMessagesFromLibrary } from "../utils/loadMessagesFromLibrary";
import "./../../../styles/generate-page.css";
import "../styles/new-record.css";

const RecordContent = () => {
  const [notification, setNotification] = useState<{
    type: "success" | "error";
    message: string;
  } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [currentRecordId, setCurrentRecordId] = useState<string | null>(null);
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [editorResetKey, setEditorResetKey] = useState(0);
  const [isLoadingFromLibrary, setIsLoadingFromLibrary] = useState(false);
  const [initialized, setInitialized] = useState(false);

  const autoSaveIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();
  const searchParams = useSearchParams();

  const {
    formData,
    setIsSubmitting,
    updateFormField,
    setRecordData,
    resetFormData,
    originalImageUrl,
    setOriginalImageUrl,
    autoSaveOn,
  } = useRecordStore();

  const { createRecord, getRecord } = useRecords();
  const {
    saveImageFile,
    removeImage,
    uploadImageToServer,
    deleteOldImage,
    resetForm,
  } = useRecordFormState();

  const loadExistingRecord = useCallback(
    async (recordId: string) => {
      setIsLoading(true);
      try {
        const result = await getRecord(recordId);
        if (result.success && result.data) {
          setRecordData(result.data);
          setCurrentRecordId(recordId);
          if (result.data.content) {
            updateFormField("content", result.data.content);
          }
        } else {
          setNotification({
            type: "error",
            message: result.message || "Не удалось загрузить запись",
          });
        }
      } catch {
        setNotification({ type: "error", message: "Ошибка загрузки записи" });
      } finally {
        setIsLoading(false);
        setInitialized(true);
      }
    },
    [getRecord, setRecordData, updateFormField],
  );

  const resetFormToEmpty = useCallback(() => {
    resetFormData();
    setEditorResetKey((prev) => prev + 1);
    setCurrentRecordId(null);
    setInitialized(true);
  }, [resetFormData]);

  useEffect(() => {
    const recordId = searchParams?.get("id");
    const source = searchParams?.get("source");

    if (recordId && source === "library") {
      loadMessagesFromLibrary({
        materialId: recordId,
        updateFormField,
        setCurrentRecordId,
        setNotification,
        setIsLoadingFromLibrary,
        setInitialized,
      });
    } else if (recordId) {
      loadExistingRecord(recordId);
    } else {
      resetFormToEmpty();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreate = useCallback(
    async (e?: React.SyntheticEvent): Promise<boolean> => {
      if (e) e.preventDefault();

      if (
        !formData.content?.trim() &&
        !formData.description?.trim() &&
        !formData.image
      )
        return false;

      setIsSubmitting(true);
      try {
        let finalImageUrl = formData.image;
        let shouldDeleteOldImage = false;

        if (formData.image && formData.image.startsWith("blob:")) {
          const uploadResult = await uploadImageToServer();
          if (uploadResult) {
            finalImageUrl = uploadResult.url;
            shouldDeleteOldImage = true;
            updateFormField("image", uploadResult.url);
          }
        } else if (!formData.image && originalImageUrl) {
          shouldDeleteOldImage = true;
          finalImageUrl = "";
        }

        if (shouldDeleteOldImage && originalImageUrl) {
          await deleteOldImage(originalImageUrl);
        }

        const recordData = {
          name: formData.name,
          image: finalImageUrl,
          description: formData.description,
          categoryId: formData.categoryId,
          categoryName: formData.categoryName,
          numericId: null,
          content: formData.content || "",
          isFeatured: formData.isFeatured || false,
          _id: currentRecordId || undefined,
        };

        const createResult = await createRecord(recordData);

        if (createResult.success) {
          if (createResult.data?.content) {
            updateFormField("content", createResult.data.content);
          }

          if (createResult.data?._id && !currentRecordId) {
            setCurrentRecordId(createResult.data?._id);
            const params = new URLSearchParams(searchParams?.toString() || "");
            params.set("id", createResult.data._id);
            params.delete("source");
            router.replace(`${window.location.pathname}?${params.toString()}`, {
              scroll: false,
            });
          }
          setOriginalImageUrl(finalImageUrl);
          if (e && !isSaving) {
            setNotification({
              type: "success",
              message: currentRecordId
                ? "Изменения сохранены"
                : "Запись успешно создана",
            });
          }
          return true;
        } else {
          if (e && !isSaving) {
            setNotification({
              type: "error",
              message: createResult.message || "Ошибка создания записи",
            });
          }
          return false;
        }
      } catch (error) {
        console.error("Ошибка:", error);
        if (e && !isSaving) {
          setNotification({
            type: "error",
            message: "Произошла непредвиденная ошибка",
          });
        }
        return false;
      } finally {
        setIsSubmitting(false);
      }
    },
    [
      formData,
      originalImageUrl,
      currentRecordId,
      createRecord,
      updateFormField,
      setOriginalImageUrl,
      setIsSubmitting,
      uploadImageToServer,
      deleteOldImage,
      isSaving,
      searchParams,
      router,
    ],
  );

  const handleCreateRef = useRef(handleCreate);

  useEffect(() => {
    handleCreateRef.current = handleCreate;
  }, [handleCreate]);

  useEffect(() => {
    const hasData =
      formData.name?.trim() !== "" ||
      formData.content?.trim() !== "" ||
      formData.description?.trim() !== "" ||
      formData.image !== "";
    setHasUnsavedChanges(hasData);
  }, [formData]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges) {
        e.preventDefault();
        e.returnValue = "";
      }
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges]);

  useEffect(() => {
    if (autoSaveIntervalRef.current) clearInterval(autoSaveIntervalRef.current);
    if (autoSaveOn && currentRecordId) {
      autoSaveIntervalRef.current = setInterval(
        () => {
          if (hasUnsavedChanges) handleCreateRef.current();
        },
        5 * 60 * 1000,
      );
    }
    return () => {
      if (autoSaveIntervalRef.current)
        clearInterval(autoSaveIntervalRef.current);
    };
  }, [autoSaveOn, currentRecordId, hasUnsavedChanges]);

  const { loadCategories } = useCategoryStore();
  useEffect(() => {
    loadCategories({ unlimited: true });
  }, [loadCategories]);

  useEffect(() => {
    if (notification) {
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });

      const timer = setTimeout(() => setNotification(null), 10000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  useEffect(() => {
    useRecordStore.getState().setSaveFunction(() => handleCreateRef.current());
    return () => useRecordStore.getState().setSaveFunction(null);
  }, []);

  const handleNewRecord = async () => {
    const hasAnyData =
      !!formData.name?.trim() ||
      !!formData.content?.trim() ||
      !!formData.description?.trim() ||
      !!formData.image;
    if (hasAnyData) {
      setIsSaving(true);
      await handleCreateRef.current();
      await new Promise((resolve) => setTimeout(resolve, 300));
      setIsSaving(false);
    }
    resetFormData();
    resetForm();
    setEditorResetKey((prev) => prev + 1);
    setCurrentRecordId(null);
    router.push("/user-dashboard/records", { scroll: false });
  };

  if (!initialized || isLoading || isLoadingFromLibrary) return <CyberLoader />;

  return (
    <div className="generate-page">
      <div className="generate-page-header">
        <Link href="/user-dashboard" className="generate-section-link">
          <ChevronLeft className="w-4 h-4" />К панели управления
        </Link>
      </div>
      <Header
        title="Рабочая тетрадь"
        description="Создание записей в тетради"
      />
      {notification && (
        <Notification
          type={notification.type}
          message={notification.message}
          onClose={() => setNotification(null)}
        />
      )}
      <RecordForm
        onFieldChange={updateFormField}
        onSaveImageFile={saveImageFile}
        onRemoveImage={removeImage}
        onSubmit={handleCreate}
        onCancel={resetForm}
        onNewRecord={handleNewRecord}
        key={editorResetKey}
      />
    </div>
  );
};

export default RecordContent;
