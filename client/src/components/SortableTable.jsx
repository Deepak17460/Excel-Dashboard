import {
  closestCorners,
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  MouseSensor,
  UniqueIdentifier,
  useSensor,
  useSensors,
} from "@dnd-kit/core";

import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useMemo, useState } from "react";

import {
  restrictToHorizontalAxis,
  restrictToVerticalAxis,
} from "@dnd-kit/modifiers";
import Items from "./Items";
import { v4 as uuidv4 } from "uuid";

const getUID = () => {
  return uuidv4().toString();
};

const SortableTable = (props) => {
  //   console.log(props.rows);
  let initData = [];
  const cols = Object.keys(props.rows[0])
    .filter((k) => k !== "id")
    .map((k, i) => ({
      id: getUID(),
      rowId: "row-" + 0,
      colId: "col-" + i,
      data: k,
    }));

  initData.push(cols);

  props.rows.map((row, idx) => {
    initData.push(
      Object.keys(row)
        .filter((k) => k !== "id")
        .map((k, i) => ({
          id: getUID(),
          rowId: "row-" + (idx + 1),
          colId: "col-" + i,
          data: row[k],
        }))
    );
  });

  const memoizedData = useMemo(() => initData, []);

  const initCols = () => memoizedData[0].map((item) => item.colId);
  const initRows = () => memoizedData.map((row) => row[0].rowId);

  const [containers, setContainers] = useState(initData);
  const [activeId, setActiveId] = useState(null);
  const [columnHover, setColumnHover] = useState(false);
  const [columnIds, setColumnIds] = useState(initCols);
  const [rowIds, setRowIds] = useState(initRows);

  console.log(containers);

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(MouseSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event) => {
    const { active } = event;
    const { id } = active;
    setActiveId(id);
  };

  const handleDragMove = (event) => {};

  const handleDragEnd = (event) => {
    const { active, over } = event;
    // row swap
    if (
      activeId.toString().includes("row") &&
      activeId.toString().includes("row") &&
      active &&
      over &&
      activeId !== over.id
    ) {
      const activeRowIndex = containers.findIndex((row) => {
        if (activeId === row[0].rowId) return true;
      });
      let overRowIndex = activeRowIndex;
      overRowIndex = containers.findIndex((row) => {
        if (over.id === row[0].rowId) return true;
      });

      overRowIndex = overRowIndex === 0 ? activeRowIndex : overRowIndex;
      overRowIndex = overRowIndex === -1 ? activeRowIndex : overRowIndex;

      let newCont = [...containers];
      newCont = arrayMove(newCont, activeRowIndex, overRowIndex);

      setContainers(newCont);
      setRowIds(newCont.map((row) => row[0].rowId));
    }

    // col swap
    else if (
      activeId.toString().includes("col") &&
      activeId.toString().includes("col") &&
      active &&
      over &&
      activeId !== over.id
    ) {
      console.log(activeId, over.id);
      let activeColIndex = -1;
      containers.forEach((row) => {
        for (let i in row) {
          if (activeId === row[i].colId) {
            activeColIndex = i;
            break;
          }
        }
      });
      let overColIndex = activeColIndex;
      containers.forEach((row) => {
        for (let i in row) {
          if (over.id === row[i].colId) {
            overColIndex = i;
            break;
          }
        }
      });

      const newCont = [...containers];
      newCont.forEach((row, i) => {
        newCont[i] = arrayMove(row, activeColIndex, overColIndex);
      });
      setContainers(newCont);
      setColumnIds(newCont[0].map((items) => items.colId));
    }
    setActiveId(null);
  };

  const handleHover = (isHovering) => {
    setColumnHover(isHovering);
  };

  return (
    <>
      <div className="">
        <div className="">
          <div className="">
            <DndContext
              sensors={sensors}
              collisionDetection={closestCorners}
              onDragStart={handleDragStart}
              onDragMove={handleDragMove}
              onDragEnd={handleDragEnd}
              modifiers={[
                columnHover ? restrictToHorizontalAxis : restrictToVerticalAxis,
              ]}
            >
              <SortableContext
                items={columnHover ? columnIds : rowIds}
                strategy={
                  columnHover
                    ? horizontalListSortingStrategy
                    : verticalListSortingStrategy
                }
              >
                {containers.map((row, i) => (
                  <div
                    key={i}
                    className="flex"
                    onMouseEnter={() => i === 0 && handleHover(true)}
                    onMouseLeave={() => i === 0 && handleHover(false)}
                  >
                    {row.map((item, i) =>
                      columnHover ? (
                        <Items
                          key={i + item.colId}
                          id={item.colId}
                          val={item.data}
                          type={"col"}
                        />
                      ) : (
                        <Items
                          key={i + item.rowId}
                          id={item.rowId}
                          val={item.data}
                          type={"row"}
                        />
                      )
                    )}
                  </div>
                ))}
              </SortableContext>
              {/* <DragOverlay>
                  {activeId
                    ? containers.map((row) => (
                        <div className={columnHover ? "" : "flex"}>
                          {row.map((item) => {
                            if (
                              item.rowId === activeId ||
                              item.colId === activeId
                            ) {
                              return (
                                <Items
                                  key={item.rowId || item.colId}
                                  id={item.rowId || item.colId}
                                  val={item.data}
                                  type={columnHover ? "col" : "row"}
                                />
                              );
                            }
                            return null;
                          })}
                        </div>
                      ))
                    : null}
                </DragOverlay> */}
            </DndContext>
          </div>
        </div>
      </div>
    </>
  );
};

export default SortableTable;
