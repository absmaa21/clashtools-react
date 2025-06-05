import {useState} from "react";
import {ResourceType} from "../../enums/ResourceType.ts";
import {
  Box,
  Button,
  TextField,
  MenuItem,
  Typography,
  Divider,
  IconButton,
  Paper,
  Grid, Container, InputAdornment, Tooltip
} from '@mui/material';
import {Add, ContentCut, Delete, Image} from '@mui/icons-material';
import useEntities from "../../hooks/useEntities.ts";
import ConfirmationDialog from "../../components/ConfirmationDialog.tsx";
import {getResourceByType} from "../../utils/CocAssets.ts";

interface Props {
  entity: Entity,
  initEntityLevel: EntityLevel,
  closeModal: () => void,
}

function EntityLevelForm({entity, initEntityLevel, closeModal}: Props) {

  const isNew: boolean = initEntityLevel.id <= 0
  const Entities = useEntities()
  const [entityLevel, setEntityLevel] = useState<EntityLevel>(initEntityLevel)
  const [deleteRequested, setDeleteRequested] = useState<boolean>(false)
  const [cutExtras, setCutExtras] = useState<boolean>(true)

  const handleChange = (field: keyof EntityLevel, value: string | number) => {
    setEntityLevel(prev => ({ ...prev, [field]: value }));
  }

  const handlePasteChange = (imgPath: string) => {
    setEntityLevel(p => ({
      ...p,
      imgPath: imgPath.substring(0, imgPath.indexOf('.png')+4),
    }))
  }

  const handleStatChange = (index: number, field: 'key' | 'value', value: string | number) => {
    setEntityLevel(prev => {
      const newStats = [...prev.stats];
      newStats[index] = { ...newStats[index], [field]: value };
      return { ...prev, stats: newStats };
    });
  };

  const addStat = () => {
    setEntityLevel(prev => ({
      ...prev,
      stats: [...prev.stats, { key: '', value: '' }],
    }));
  };

  const removeStat = (index: number) => {
    setEntityLevel(prev => {
      const newStats = [...prev.stats];
      newStats.splice(index, 1);
      return { ...prev, stats: newStats };
    });
  };

  return (
    <Container maxWidth={'md'}>
      <Paper elevation={3} sx={{ p: 3 }}>
       <Grid container>
         <Grid size={1}/>
         <Grid size={10}>
           <Typography variant="h6" sx={{textAlign: 'center', mb: 3}}>
             {isNew ? `New Level ` : `Edit Level ${initEntityLevel.level} `} for {entity.name}
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
              label="Level"
              type="number"
              value={entityLevel.level}
              onChange={(e) => handleChange('level', parseInt(e.target.value) || 0)}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Cost"
              type="number"
              value={entityLevel.cost}
              onChange={(e) => handleChange('cost', parseInt(e.target.value) || 0)}
            />
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              select
              label="Resource Type"
              value={entityLevel.resource}
              onChange={(e) => handleChange('resource', e.target.value)}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={getResourceByType(entityLevel.resource)} alt={'resource-img'} style={{
                        height: 24, objectFit: 'contain'
                      }} />
                    </InputAdornment>
                  ),
                },
              }}
            >
              {Object.values(ResourceType).filter(t => typeof t !== 'string').map(type => (
                <MenuItem key={ResourceType[type]} value={type}>
                  {ResourceType[type]}
                </MenuItem>
              ))}
            </TextField>
          </Grid>

          <Grid size={{xs: 12, sm: 6}}>
            <TextField
              fullWidth
              label="Upgrade Time (seconds)"
              type="number"
              value={entityLevel.upgradeTime}
              onChange={(e) => handleChange('upgradeTime', parseInt(e.target.value) || 0)}
            />
          </Grid>

          <Grid size={12}>
            <TextField
              fullWidth
              label="Image Url"
              type="url"
              value={entityLevel.imgPath}
              onChange={e => handleChange('imgPath', e.target.value)}
              onPaste={e => {
                if (!cutExtras) return
                e.preventDefault()
                handlePasteChange(e.clipboardData.getData('text/plain'))
              }}
              slotProps={{
                input: {
                  startAdornment: (
                    <InputAdornment position="start">
                      <img src={entityLevel.imgPath} alt={'resource-img'} style={{
                        height: 32, objectFit: 'contain'
                      }} />
                    </InputAdornment>
                  ),
                  endAdornment: (
                    <InputAdornment position="end">
                      <Tooltip title={cutExtras ? 'Remove wiki extras on paste' : 'Keep wiki extras on paste'}>
                        <IconButton onClick={() => setCutExtras(!cutExtras)} style={{
                          opacity: cutExtras ? 0.8 : 0.5
                        }}>
                          {cutExtras ? <ContentCut/> : <Image/>}
                        </IconButton>
                      </Tooltip>
                    </InputAdornment>
                  )
                },
              }}
            />
          </Grid>
        </Grid>

        <Divider sx={{ my: 3 }} />

        <Typography variant="h6" gutterBottom>
          Stats
        </Typography>

        {entityLevel.stats.map((stat, index) => (
          <Box key={index} sx={{ display: 'flex', gap: 2, mb: 2, alignItems: 'center' }}>
            <TextField
              label="Key"
              value={stat.key}
              onChange={(e) => handleStatChange(index, 'key', e.target.value)}
              sx={{ flex: 1 }}
            />
            <TextField
              label="Value"
              value={stat.value as string}
              onChange={(e) => handleStatChange(index, 'value', e.target.value)}
              sx={{ flex: 1 }}
            />
            <IconButton onClick={() => removeStat(index)} color="error">
              <Delete />
            </IconButton>
          </Box>
        ))}

        <Box sx={{ mt: 4, display: 'flex', justifyContent: 'space-between' }}>
          <Button
            variant="outlined"
            startIcon={<Add />}
            onClick={addStat}
          >
            Add Stat
          </Button>

          <div>
            <Button variant="contained" color="primary" sx={{ mr: 2 }} onClick={() => {
              if (isNew) Entities.addLevel(entity, entityLevel).then(closeModal)
              else Entities.editLevel(entity, entityLevel).then(closeModal)
            }}>
              {isNew ? 'Add' : 'Save'}
            </Button>
            <Button variant="outlined" onClick={closeModal}>Cancel</Button>
          </div>
        </Box>
      </Paper>

      <ConfirmationDialog
        open={deleteRequested}
        onClose={isAccepted => {
          setDeleteRequested(false)
          if (isAccepted) {
            Entities.removeLevel(entity, entityLevel).then(closeModal)
          }
        }}
        title={`Delete ${entity.name} Level ${entityLevel.level}?`}
        desc={`Are you sure, you want to delete ${entity.name} of Level ${entityLevel.level}?`}
      />
    </Container>
  );
}

export default EntityLevelForm;