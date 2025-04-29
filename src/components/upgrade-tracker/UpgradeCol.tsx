import {Box, TableCell} from "@mui/material";

interface Props {
  entityLevel: EntityLevel,
}

function UpgradeCol({entityLevel}: Props) {
  return (
    <TableCell sx={{ width: {sm: '33%', md: 200} }}>
      <Box sx={{display: 'flex', justifyContent: 'center', gap: 2}}>

      </Box>
    </TableCell>
  )
}

export default UpgradeCol;