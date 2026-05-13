import { useOptimistic, useState, useTransition, memo } from "react";
import { useRecordsManagementStore } from "@/store/recordsManagementStore";
import { SearchBar } from "./SearchBar";
import { Record } from "../types";
import { RecordTableProps } from "../types";
import { ResultsStats } from "./ResultsStats";
import { FilterControls } from "./FilterControls";
import { AdvancedFilters } from "./AdvancedFilters";
import { TableHeader } from "./TableHeader";
import "../styles/record-table.css";
import { SortableItem } from "./SortableItem";
import { RecordsEmptyState } from "./RecordEmptyState";

export const RecordTable = memo(({ onReorder, onDelete }: RecordTableProps) => {
  const {
    records,
    loading,
    draggedId,
    setDraggedId,
    dragOverId,
    setDragOverId,
  } = useRecordsManagementStore();

  const [showFilters, setShowFilters] = useState(false);
  const [isPending, startTransition] = useTransition();

  const [optimisticRecords, setOptimisticRecords] = useOptimistic(
    records,
    (
      currentRecords,
      { draggedId, droppedId }: { draggedId: string; droppedId: string },
    ) => {
      const draggedRecord = currentRecords.find(
        (a) => a._id.toString() === draggedId,
      );
      const droppedRecord = currentRecords.find(
        (a) => a._id.toString() === droppedId,
      );

      if (!draggedRecord || !droppedRecord) return currentRecords;

      return currentRecords
        .map((record) => {
          if (record._id.toString() === draggedId) {
            return { ...record, numericId: droppedRecord.numericId };
          }

          if (record._id.toString() === droppedId) {
            return { ...record, numericId: draggedRecord.numericId };
          }

          return record;
        })
        .sort((a, b) => a.numericId - b.numericId);
    },
  );

  const handleDragStart = (id: string) => {
    setDraggedId(id);
  };

  const handleDragOver = (e: React.DragEvent, id: string) => {
    e.preventDefault();
    if (draggedId && draggedId !== id) {
      setDragOverId(id);
    }
  };

  const handleDrop = async (e: React.DragEvent, droppedId: string) => {
    e.preventDefault();

    if (!draggedId || draggedId === droppedId) {
      setDraggedId(null);
      setDragOverId(null);
      return;
    }

    startTransition(() => {
      setOptimisticRecords({ draggedId, droppedId });
    });

    try {
      const draggedRecord = records.find((r) => r._id.toString() === draggedId);
      const droppedRecord = records.find((r) => r._id.toString() === droppedId);

      if (!draggedRecord || !droppedRecord) return;

      const updatedDraggedRecord = {
        ...draggedRecord,
        numericId: droppedRecord.numericId,
      };
      const updatedDroppedRecord = {
        ...droppedRecord,
        numericId: draggedRecord.numericId,
      };

      if (onReorder) {
        onReorder([updatedDraggedRecord, updatedDroppedRecord]);
      }
    } catch (error) {
      console.error("Ошибка", error);
    } finally {
      setDraggedId(null);
      setDragOverId(null);
    }
  };

  const getDisplayNumericId = (record: Record): number | null => {
    return record.numericId;
  };

  if (loading) {
    return <div className="record-table-loading">Загрузка записей...</div>;
  }

  return (
    <div className="record-table-container">
      <div className="record-table-header">
        <div className="record-table-header-content">
          <SearchBar />
          <FilterControls onToggleFilters={setShowFilters} />
        </div>

        <ResultsStats />

        {showFilters && <AdvancedFilters />}
      </div>

      <TableHeader />

      <div className="record-table-items">
        {records.length === 0 ? (
          <RecordsEmptyState />
        ) : (
          optimisticRecords.map((record) => {
            const recordId = record._id.toString();
            const isDragOver = dragOverId === recordId;

            return (
              <div
                key={recordId}
                draggable="true"
                onDragStart={() => handleDragStart(recordId)}
                onDragOver={(e) => handleDragOver(e, recordId)}
                onDrop={(e) => handleDrop(e, recordId)}
                className={`record-table-item ${isDragOver ? "record-table-item-drag-over" : ""} ${isPending ? "record-table-item-pending" : ""}`}
              >
                <SortableItem
                  id={recordId}
                  record={record}
                  displayNumericId={getDisplayNumericId(record)}
                  onDelete={onDelete}
                />
              </div>
            );
          })
        )}
      </div>
    </div>
  );
});

RecordTable.displayName = 'RecordTable';