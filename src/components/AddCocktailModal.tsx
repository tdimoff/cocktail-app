import { Modal, Fade, Backdrop, Box } from "@mui/material";
import AddCocktailForm from "./AddCocktailForm";
import styles from "../styles/AddCocktailModal.module.scss";

interface AddCocktailModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCocktailAdded: () => void;
}

const AddCocktailModal = ({ isOpen, onClose, onCocktailAdded }: AddCocktailModalProps) => {
  return (
    <Modal
      open={isOpen}
      onClose={onClose}
      closeAfterTransition
      slots={{ backdrop: Backdrop }}
      slotProps={{
        backdrop: {
          sx: {
            transition: 'opacity 0.5s ease-in-out',
          },
        },
      }}
    >
      <Fade in={isOpen}>
        <Box className={styles['add-cocktail-modal__content']}>
          <AddCocktailForm onCocktailAdded={onCocktailAdded} />
        </Box>
      </Fade>
    </Modal>
  );
};

export default AddCocktailModal;
