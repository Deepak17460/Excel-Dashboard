import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import clsx from "clsx";
import React from "react";

const Items = ({ id, val, type }) => {
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
      {...listeners}
      ref={setNodeRef}
      {...attributes}
      style={{ transition, transform: CSS.Translate.toString(transform) }}
      className={`m-1 px-2 py-2 shadow-md rounded-xl w-full border border-transparent border-2
        max-w-[500px] max-h-[100px] overflow-auto
        ${isDragging ? "bg-gray-100" : "bg-white"}
          
        `}
    >
      <div className="flex flex-center justify-between">
        {val}
        {/* <button
          className="border p-2 rounded-xl shadow-lg hover:shadow-xl"
          {...listeners}
        >
          Drag
        </button> */}
      </div>
    </div>
  );
};

export default Items;
