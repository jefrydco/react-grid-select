import React from "react";
import { useEffect, useState, useCallback } from "react";
import { GridCell } from "./GridCell";
import { createUseStyles } from "react-jss";
import clsx from "clsx";
import { debounce } from "lodash";

export type RegionSelectionProps = {
  rows?: number;
  cols?: number;
  onRegionUpdate: Function;
  cellSize?: number;
  bounds?: {
    maxWidthBlock: {
      width: number;
      height: number;
    };
    maxHeightBlock: {
      width: number;
      height: number;
    };
  };
  disabled?: boolean;
  styles?: {
    active?: any;
    hover?: any;
    cell?: any;
    grid?: any;
    disabled?: any;
  };
};

type CoordsType = {
  x: number;
  y: number;
};

const useStyles = createUseStyles({
  grid: {
    position: "relative",
    display: "grid",
    color: "#444",
    margin: "24px 0",
    gridGap: "2px 4px",
  },
  cell: {},
});

const GridSelect = ({
  onRegionUpdate,
  rows = 5,
  cols = 5,
  disabled = false,
  cellSize = 24,
  styles,
}: RegionSelectionProps) => {
  const baseClasses = useStyles();
  const [activeCell, setActiveCell] = useState<CoordsType>({
    x: 0,
    y: 0,
  });
  const [hoverCell, setHoverCell] = useState<CoordsType>(null);

  // Whenever the active cell changes, call the user's function with the selected size
  useEffect(() => {
    onRegionUpdate({
      width: activeCell.x + 1,
      height: activeCell.y + 1,
    });
  }, [activeCell]);

  // grid setting
  const gridCss = {
    // TODO: / FIXME: how the fuck do we get this value?!?!??
    gridTemplateColumns: Array(cols).fill(`${cellSize}px`).join(" "),
  };

  const onClick = ({x, y}) => {
    if (disabled) {return null};
    if (activeCell.x === x && activeCell.y === y) {return null};
    setActiveCell({ x, y });
  };

  // debounce every 5ms so we dont lag with DOM updates
  const onHover = useCallback(
    debounce(({x, y}) => {
      if (disabled) {return null};
      setHoverCell({ x, y });
    }, 5)
  , [disabled]);

  const cells = [];
  for (let x = 0; x < rows; x++) {
    for (let y = 0; y < cols; y++) {
      const isActive = x <= activeCell.x && y <= activeCell.y;
      const isHover = hoverCell && x <= hoverCell.x && y <= hoverCell.y;
      cells.push(
        <GridCell
          key={x + "-" + y}
          onClick={() => onClick({x, y})}
          onMouseEnter={onHover.bind(null, {x, y})}   
          active={isActive}
          hover={isHover}
          disabled={disabled}
          styles={styles}
          cellSize={cellSize}
        />
      );
    }
  }

  return (
    <div
      className={baseClasses.grid}
      style={gridCss}
      onMouseLeave={() => setHoverCell(null)}
    >
      {cells}
    </div>
  );
};

export { GridSelect };
