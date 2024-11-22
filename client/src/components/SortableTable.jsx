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

import { Button } from "@mui/material";

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
  const [isEditMode, setIsEditMode] = useState(props.isEditMode);

  //   console.log(containers);

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

  const onChangeHandler = (e) => {};

  const editRowCell = (id, val) => {
    const newData = JSON.parse(JSON.stringify(containers));
    let rowI = -1;
    let colI = -1;
    console.log(newData);
    for (let i in newData) {
      colI = newData[i].findIndex((item) => item.id === id);
      if (colI !== -1) {
        rowI = i;
        break;
      }
    }
    console.log(val);
    console.log(id, rowI, colI);
    newData[rowI][colI] = { ...newData[rowI][colI], data: val };
    console.log("init val - ", newData[rowI][colI]);
    console.log("new val - ", val);
    setContainers(newData);
  };
  const addRow = () => {};
  
  const addCol = () => {};
  
  const handleSubmit = () => {
    setIsEditMode(false);
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  return (
    <>
      {isEditMode ? (
        <>
          <Button variant="contained" color="success" onClick={addRow}>
            Add Row
          </Button>
          <Button variant="contained" color="success" onClick={addCol}>
            Add Column
          </Button>
          {/* <Button variant="contained" color="success" onClick={handleSave}>
            Save
          </Button> */}
          <Button variant="contained" color="success" onClick={handleSubmit}>
            Submit
          </Button>
        </>
      ) : (
        <>
          <Button onClick={handleEditClick} variant="contained" color="primary">
            Edit
          </Button>
        </>
      )}
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
                {containers.map((row, rowI) => (
                  <div
                    key={rowI}
                    className="flex"
                    onMouseEnter={() => rowI === 0 && handleHover(true)}
                    onMouseLeave={() => rowI === 0 && handleHover(false)}
                  >
                    {row.map((item, colI) =>
                      columnHover ? (
                        <Items
                          key={item.id}
                          id={item.colId}
                          val={item.data}
                          itemId={item.id}
                          type={"col"}
                          onChangeHandler={editRowCell}
                        />
                      ) : (
                        <Items
                          key={item.id}
                          id={item.rowId}
                          val={item.data}
                          itemId={item.id}
                          type={"row"}
                          onChangeHandler={editRowCell}
                        />
                      )
                    )}
                  </div>
                ))}
              </SortableContext>
            </DndContext>
          </div>
        </div>
      </div>
    </>
  );
};

export default SortableTable;
