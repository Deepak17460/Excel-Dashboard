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
import axios from "axios";
import { useParams } from "react-router-dom";

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

const URL = `${process.env.REACT_APP_SERVER_URL}/spreadsheet/`;

const getUID = () => {
  return uuidv4().toString();
};

const getCols = (data) => {
  return data[0].map((item) => item.data);
};

const convertToPayloadType = (data) => {
  const cols = getCols(data);
  return data.slice(1).reduce((acc, item) => {
    let obj = {};
    console.log(item);
    cols.forEach((col, i) => {
      obj = { ...obj, [col]: item[i].data };
    });
    return [...acc, obj];
  }, []);
};

const SortableTable = (props) => {
  const { id } = useParams();
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
  const [fixedContainers, setFixedContainers] = useState([]);
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

  const addRow = () => {
    const newData = JSON.parse(JSON.stringify(containers));
    const cols = getCols(containers);
    const len = containers.length;
    const newRow = cols.reduce((acc, c, i) => {
      const obj = {
        id: getUID(),
        rowId: "row-" + len,
        colId: "col-" + i,
        data: "",
      };

      return [...acc, obj];
    }, []);
    newData.push(newRow);
    setContainers(newData);
  };

  const addCol = () => {
    let newData = JSON.parse(JSON.stringify(containers));
    const colLen = containers[0].length;

    newData.forEach((row, i) => {
      const obj = {
        id: getUID(),
        rowId: "row-" + i,
        colId: "col-" + colLen,
        data: "",
      };
      row.push(obj);
    });
    // console.log(newData);
    setContainers(newData);
  };

  const deleteRowOrCol = (row, col, type) => {
    let newData = JSON.parse(JSON.stringify(containers));
    if (type === "row") {
      newData = newData.filter((_, i) => i !== row);
      setContainers(newData);
    } else {
      newData = newData.map((row) => row.filter((item, i) => i !== col));
      setContainers(newData);
    }
  };

  const handleSubmit = async () => {
    try {
      const payload = convertToPayloadType(containers);
      await axios.put(
        URL + "/" + id,
        { data: payload },
        { withCredentials: true }
      );
      console.log("Edited!");
    } catch (err) {
      console.log(err);
    } finally {
      setIsEditMode(false);
    }
  };

  const handleEditClick = () => {
    setIsEditMode(true);
  };

  const handelFixedRows = (rowAdd, rowRem) => {
    if (rowAdd !== null) setFixedContainers([...fixedContainers, rowAdd]);
    else setFixedContainers(fixedContainers.filter((item) => item !== rowRem));
  };

  console.log(fixedContainers);
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
      <div className="flex flex-col items-center justify-center mt-10">
        <div className="container w-full overflow-auto flex flex-col border border-gray-300 bg-gray-100">
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
              <div className="w-max">
                {containers
                  .filter((row, i) => fixedContainers.includes(row[0].rowId))
                  .map((row, rowI) => (
                    <div
                      key={rowI}
                      className="flex"
                      onMouseEnter={() => rowI === 0 && handleHover(true)}
                      onMouseLeave={() => rowI === 0 && handleHover(false)}
                    >
                      {row.map((item, colI) => (
                        <Items
                          key={item.id}
                          id={columnHover ? item.colId : item.rowId}
                          val={item.data}
                          itemId={item.id}
                          isEditMode={isEditMode}
                          type={columnHover ? "col" : "row"}
                          indexR={rowI}
                          indexC={colI}
                          rowId={item.rowId}
                          colId={item.colId}
                          fixed={true}
                          onChangeHandler={editRowCell}
                          deleteHandler={deleteRowOrCol}
                          fixedContainers={fixedContainers}
                          handelFixedRows={handelFixedRows}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
        <div className="container w-full h-[480px] overflow-auto flex flex-col border border-gray-300 bg-gray-100">
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
              <div className="w-max">
                {containers
                  .filter((row, i) => !fixedContainers.includes(row[0].rowId))
                  .map((row, rowI) => (
                    <div
                      key={rowI}
                      className="flex"
                      onMouseEnter={() => rowI === 0 && handleHover(true)}
                      onMouseLeave={() => rowI === 0 && handleHover(false)}
                    >
                      {row.map((item, colI) => (
                        <Items
                          key={item.id}
                          id={columnHover ? item.colId : item.rowId}
                          val={item.data}
                          itemId={item.id}
                          isEditMode={isEditMode}
                          type={columnHover ? "col" : "row"}
                          indexR={rowI}
                          indexC={colI}
                          onChangeHandler={editRowCell}
                          deleteHandler={deleteRowOrCol}
                          fixedContainers={fixedContainers}
                          rowId={item.rowId}
                          colId={item.colId}
                          fixed={false}
                          handelFixedRows={handelFixedRows}
                        />
                      ))}
                    </div>
                  ))}
              </div>
            </SortableContext>
          </DndContext>
        </div>
      </div>
    </>
  );
};

export default SortableTable;
