import { createContext, useContext } from "react";

interface RecordContextType {
  categoryName: string;
  recordName: string;
}

const RecordContext = createContext<RecordContextType>({
  categoryName: "",
  recordName: "",
});

export const useRecordContext = () => useContext(RecordContext);
export const RecordProvider = RecordContext.Provider;
