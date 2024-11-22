import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DragHandleIcon from "@mui/icons-material/DragHandle";

import React from "react";

const Items = ({
  id,
  itemId,
  val,
  isEditMode,
  indexR,
  indexC,
  type,
  onChangeHandler,
}) => {
  const {
    attributes,
    setNodeRef,
    listeners,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id,
    data: { type },
  });
  return (
    <div
      //   {...listeners}
      ref={setNodeRef}
      {...attributes}
      style={{ transition, transform: CSS.Translate.toString(transform) }}
      className={`m-1 px-2 py-2 shadow-md rounded-xl w-full border border-transparent border-2
        max-w-[500px] max-h-[100px] overflow-auto
        ${isDragging ? "bg-gray-100" : "bg-white"}
          `}
    >
      <div className={`flex flex-center ${indexR === 0 && "justify-between"}`}>
        {indexR !== 0 && indexC === 0 && <DragHandleIcon {...listeners} />}
        {isEditMode ? (
          <input
            className="px-2"
            value={val}
            onChange={(e) => onChangeHandler(itemId, e.target.value)}
          />
        ) : (
          <h1 className="px-2">{val}</h1>
        )}
        {indexR === 0 && <DragIndicatorIcon {...listeners} />}
      </div>
    </div>
  );
};

export default Items;
