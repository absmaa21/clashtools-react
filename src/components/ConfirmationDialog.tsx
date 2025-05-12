import {Button, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from "@mui/material";

interface Props {
  open: boolean,
  onClose: (accepted: boolean) => void,
  title: string,
  desc: string,
}

function ConfirmationDialog({ open, onClose, title, desc }: Props) {
  return (
    <Dialog
      open={open}
      onClose={() => onClose(false)}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
    >
      <DialogTitle id="alert-dialog-title">
        {title}
      </DialogTitle>
      <DialogContent>
        <DialogContentText id="alert-dialog-description">
          {desc}
        </DialogContentText>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => onClose(false)}>Disagree</Button>
        <Button onClick={() => onClose(true)} autoFocus>
          Agree
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ConfirmationDialog;