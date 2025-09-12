import { tableStyles } from "@/app/(admin)/administrator/styles";

  export const columns = [
    { key: "id", label: "ID", span: tableStyles.colSpans.id, sortable: true },
    {
      key: "name",
      label: "Имя Фамилия",
      span: tableStyles.colSpans.name,
      sortable: true,
    },
    {
      key: "age",
      label: "Возраст",
      span: tableStyles.colSpans.age,
      sortable: true,
    },
    {
      key: "email",
      label: "Email",
      span: tableStyles.colSpans.email,
      sortable: true,
    },
    {
      key: "phoneNumber",
      label: "Телефон",
      span: tableStyles.colSpans.phone,
      sortable: true,
    },
    {
      key: "role",
      label: "Роль",
      span: tableStyles.colSpans.role,
      sortable: true,
    },
    {
      key: "createdAt",
      label: "Регистрация",
      span: tableStyles.colSpans.registration,
      sortable: true,
    },
  ];