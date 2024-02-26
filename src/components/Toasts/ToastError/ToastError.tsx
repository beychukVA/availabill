import * as React from "react";
import { Trans, t } from "@lingui/macro";
import MuiAlert, { AlertProps } from "@mui/material/Alert";
import Snackbar, { SnackbarOrigin } from "@mui/material/Snackbar";

interface IProps {
  handleClose: (event?: React.SyntheticEvent | Event, reason?: string) => void;
  duration: number;
  open: boolean;
  message: string;
}

// eslint-disable-next-line react/display-name
const Alert = React.forwardRef<HTMLDivElement, AlertProps>((props, ref) => (
  // eslint-disable-next-line react/jsx-props-no-spreading
  <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />
));

export const ToastError: React.FC<IProps> = ({
  handleClose,
  duration = 6000,
  open = false,
  message = t`Ein Fehler ist aufgetreten!`,
}) => {
  const [state, setState] = React.useState<SnackbarOrigin>({
    vertical: "bottom",
    horizontal: "right",
  });

  const { vertical, horizontal } = state;

  return (
    <Snackbar
      anchorOrigin={{ vertical, horizontal }}
      open={open}
      autoHideDuration={duration}
      onClose={handleClose}
    >
      <Alert onClose={handleClose} severity="error" sx={{ width: "100%" }}>
        <div className="toastError">{message}</div>
      </Alert>
    </Snackbar>
  );
};
