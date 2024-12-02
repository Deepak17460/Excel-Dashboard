import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import DragIndicatorIcon from "@mui/icons-material/DragIndicator";
import DragHandleIcon from "@mui/icons-material/DragHandle";
import DeleteRoundedIcon from "@mui/icons-material/DeleteRounded";
import PushPinOutlinedIcon from "@mui/icons-material/PushPinOutlined";
import PushPinIcon from "@mui/icons-material/PushPin";
import React, { useState } from "react";

const Items = ({
  id,
  itemId,
  val,
  isEditMode,
  rowId,
  colId,
  indexR,
  indexC,
  type,
  fixed,
  onChangeHandler,
  deleteHandler,
  fixedRowContainers,
  handelFixedRows,
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
      className={`m-1 px-2 py-2 shadow-md w-full border border-transparent border-2 flex 
        justify-between max-w-[300px] max-h-[100px] overflow-auto
        ${isDragging ? "bg-gray-100" : "bg-white"}
          `}
    >
      <div className={`flex flex-row ${indexR === 0 && "justify-start"}`}>
        {indexR === 0 && (
          <DragIndicatorIcon
            className={`${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            {...listeners}
          />
        )}
        {indexR !== 0 && indexC === 0 && (
          <DragHandleIcon
            className={`${isDragging ? "cursor-grabbing" : "cursor-grab"}`}
            {...listeners}
          />
        )}
        {isEditMode ? (
          <input
            className="px-4 py-1 w-full border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            value={val}
            onChange={(e) => onChangeHandler(itemId, e.target.value)}
          />
        ) : (
          <h1
            className={`px-4 ${
              rowId === "row-0" ? "text-2xl font-bold" : "text-xl"
            }`}
          >
            {val}
          </h1>
        )}
        <div className="px-1">
          {isEditMode && (indexC === 0 || indexR === 0) && (
            <DeleteRoundedIcon
              onClick={(e) => deleteHandler(indexR, indexC, type)}
              color="error"
            />
          )}
          {fixed ? (
            <PushPinIcon
              onClick={() => handelFixedRows(null, fixedRowContainers[indexR])}
            />
          ) : (
            <PushPinOutlinedIcon onClick={() => handelFixedRows(rowId, null)} />
          )}
        </div>
      </div>
    </div>
  );
};

export default Items;
