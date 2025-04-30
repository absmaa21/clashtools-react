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
  Grid, Container
} from '@mui/material';
import { Add, Delete } from '@mui/icons-material';
import useEntities from "../../hooks/useEntities.ts";

interface Props {
  entity: Entity,
  initEntityLevel: EntityLevel,
  closeModal: () => void,
}

function EntityLevelForm({entity, initEntityLevel, closeModal}: Props) {

  const isNew: boolean = initEntityLevel.id.length <= 0
  const Entities = useEntities()
  const [entityLevel, setEntityLevel] = useState<EntityLevel>(initEntityLevel ?? {
    id: '',
    level: 0,
    stats: [],
    cost: 0,
    resource: ResourceType.GOLD,
    upgradeTime: 0,
    imgPath: '',
  })

  const handleChange = (field: keyof EntityLevel, value: string | number) => {
    setEntityLevel(prev => ({ ...prev, [field]: value }));
  };

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
        <Typography variant="h6" sx={{textAlign: 'center', mb: 3}}>
          {isNew ? `New Level ` : `Edit Level ${initEntityLevel.level} `} for {entity.name}
        </Typography>

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
            >
              {Object.values(ResourceType).filter(t => typeof t === 'string').map(type => (
                <MenuItem key={type} value={type}>
                  {type}
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
              if (isNew) Entities.addLevel(entity, entityLevel)
              else Entities.editLevel(entity, entityLevel)
              closeModal()
            }}>
              {isNew ? 'Add' : 'Save'}
            </Button>
            <Button variant="outlined" onClick={closeModal}>Cancel</Button>
          </div>
        </Box>
      </Paper>
    </Container>
  );
}

export default EntityLevelForm;