import React from "react";
import Popover from "@mui/material/Popover";
import Typography from "@mui/material/Typography";

export const PopoverWrapper = ({
  children,
  anchorEl,
}: {
  children: React.ReactNode;
  anchorEl: Element | ((element: Element) => Element) | null | undefined;
}) => {
  const id = anchorEl ? "popover-id" : undefined;

  return (
    <div>
      <Popover
        id={id}
        open={!!anchorEl}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
      >
        <Typography
          onClick={(e) => {
            e.stopPropagation();
          }}
          sx={{ p: 2 }}
        >
          {children}
        </Typography>
      </Popover>
    </div>
  );
};
