import React from "react";
import { Snackbar, Alert } from "@mui/material";

const XPToast = ({ open, xpAmount, onClose }) => {
  return (
    <Snackbar open={open} autoHideDuration={2000} onClose={onClose} anchorOrigin={{ vertical: "bottom", horizontal: "center" }}>
      <Alert onClose={onClose} severity="success" variant="filled">
        🎉 +{xpAmount} XP Earned!
      </Alert>
    </Snackbar>
  );
};

export default XPToast;
