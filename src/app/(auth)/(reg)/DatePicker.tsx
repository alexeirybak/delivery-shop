"use client";
import React, { useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { format } from "date-fns";
import ru from "date-fns/locale/ru";

interface CustomDatePickerProps {
  selected: Date | null;
  onChange: (date: Date | null) => void;
}

export const CustomDatePicker = ({
  selected,
  onChange,
}: CustomDatePickerProps) => {
  return (
    <DatePicker
      selected={selected}
      onChange={onChange}
      locale={ru}
      dateFormat="dd.MM.yyyy"
      placeholderText="Выберите дату"
      className="border rounded px-3 py-2 w-full"
      showYearDropdown
      dropdownMode="select"
    />
  );
};
