import React from 'react';
import { Modal, Fade, Backdrop, Box } from "@mui/material";
import AddCocktailForm from "./AddCocktailForm";

interface AddCocktailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCocktailAdded: () => void;
}

const AddCocktailModal: React.FC<AddCocktailModalProps> = ({ isOpen, onClose, onCocktailAdded }) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      BackdropComponent={Backdrop}
      BackdropProps={{
        timeout: 500,
      }}
    >
      <Fade in={isOpen}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            width: 400,
            bgcolor: "background.paper",
            border: "2px solid #000",
            boxShadow: 24,
            p: 4,
          }}
        >
          <AddCocktailForm onCocktailAdded={onCocktailAdded} />
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddCocktailModal;
