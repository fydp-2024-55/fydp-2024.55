import { FC, useContext } from "react";
import AppContext from "../contexts/AppContext";
import { IconButton, Snackbar } from "@material-ui/core";
import { Close } from "@mui/icons-material";

const Toast: FC = () => {
  const { toastMessage, setToastMessage } = useContext(AppContext)!;

  const handleClose = () => {
    setToastMessage("");
  };

  const action = (
    <IconButton size="small" color="inherit" onClick={handleClose}>
      <Close fontSize="small" />
    </IconButton>
  );

  return (
    <Snackbar
      open={toastMessage !== ""}
      autoHideDuration={6000}
      message={toastMessage}
      onClose={handleClose}
      anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      action={action}
    />
  );
};

export default Toast;
