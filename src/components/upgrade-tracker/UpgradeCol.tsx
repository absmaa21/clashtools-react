import {Box, TableCell} from "@mui/material";

interface Props {
  entityLevel: EntityLevel,
}

function UpgradeCol({entityLevel}: Props) {

  const finishedDate = new Date(Date.now() + (entityLevel.timeUntilCompleted ?? 0)).toLocaleString()

  return (
    <TableCell sx={{ width: {sm: '33%', md: 200} }}>
      <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>
        {`${entityLevel.level} -- ${entityLevel.timeUntilCompleted ? finishedDate : ''}`}
      </Box>
    </TableCell>
  )
}

export default UpgradeCol;