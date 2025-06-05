import {Button, Container, Grid, IconButton, Paper, TextField, Typography} from "@mui/material";
import {Delete} from "@mui/icons-material";
import {useState} from "react";
import ConfirmationDialog from "../../components/ConfirmationDialog.tsx";
import useEntities from "../../hooks/useEntities.ts";
import { Category } from "../../enums/Category.ts";

interface Props {
  initEntity: Entity,
  closeModal: () => void,
}

function EntityForm({ initEntity, closeModal }: Props) {

  const isNew: boolean = initEntity.id <= 0
  const Entities = useEntities()
  const [entity, setEntity] = useState<Entity>(initEntity)
  const [deleteRequested, setDeleteRequested] = useState<boolean>(false)

  function handleChange<K extends keyof Entity>(key: K, value: Entity[K]) {
    setEntity(p => ({
      ...p,
      [key]: value,
    }))
  }

  return (
    <Container maxWidth={'md'}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Grid container>
          <Grid size={1}/>
          <Grid size={10}>
            <Typography variant="h6" sx={{textAlign: 'center', mb: 3}}>
              {isNew ? `New Entity` : `Edit Entity ${initEntity.name} `}
            </Typography>
          </Grid>
          <Grid size={1}>
            <IconButton onClick={() => setDeleteRequested(true)} color="error">
              <Delete />
            </IconButton>
          </Grid>
        </Grid>

        <Grid container spacing={3}>
          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Name"
              type="text"
              value={entity.name}
              onChange={e => handleChange('name', e.target.value)}
            />
          </Grid>
          <Grid size={{xs: 12, sm: 6}} mb={2}>
            <TextField
              fullWidth disabled
              label="Category"
              type="text"
              value={Category[entity.category]}
            />
          </Grid>
        </Grid>

        <div>
          <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => {
            if (isNew) Entities.addEntity(entity).then(closeModal)
            else Entities.updateEntity(entity).then(closeModal)
          }}>
            {isNew ? 'Add' : 'Save'}
          </Button>
          <Button variant="outlined" onClick={closeModal}>Cancel</Button>
        </div>
      </Paper>

      <ConfirmationDialog
        open={deleteRequested}
        onClose={isAccepted => {
          setDeleteRequested(false)
          if (isAccepted) {
            Entities.removeEntity(entity.id).then(closeModal)
          }
        }}
        title={`Delete ${entity.name}?`}
        desc={`Are you sure, you want to delete ${entity.name} with all it's ${entity.levels.length} Levels?`}
      />
    </Container>
  );
}

export default EntityForm;