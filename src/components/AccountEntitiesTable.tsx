import {useState} from "react";
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TableSortLabel, Typography, Box
} from "@mui/material";
import useAccountEntity from "../hooks/useAccountEntity.ts";
import {secondsToString} from "../utils/StringMethods.ts";
import {getResourceByType} from "../utils/CocAssets.ts";

type SortKey = keyof Pick<EntityLevel, 'cost' | 'upgradeTime'>;

interface SortConfig {
  key: SortKey;
  direction: "asc" | "desc";
}

function AccountEntitiesTable() {

  const {accountEntities} = useAccountEntity()
  const nextUpgrades: AccountEntity[] = accountEntities.filter(ae => ae.entity.levels[ae.level])
  const [sortConfig, setSortConfig] = useState<SortConfig>({key: 'cost', direction: 'desc'});

  const sortedData = [...nextUpgrades].sort((a, b) => {
    const aValue: number = a.entity.levels[a.level][sortConfig.key]
    const bValue: number = b.entity.levels[b.level][sortConfig.key]

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  const requestSort = (key: SortKey) => {
    setSortConfig(prev => ({
      key,
      direction: prev.key === key ? prev.direction === "asc" ? "desc" : "asc" : prev.direction,
    }));
  };

  return (
    <TableContainer component={Paper}>
      <Table sx={{ userSelect: 'none' }}>
        <TableHead>
          <TableRow>
            <TableCell sortDirection={sortConfig.direction}>
              Name
            </TableCell>
            <TableCell sortDirection={sortConfig.direction}>
              <TableSortLabel
                active={sortConfig.key === 'cost'}
                direction={sortConfig.direction}
                onClick={() => requestSort('cost')}
              >
                Cost
              </TableSortLabel>
            </TableCell>
            <TableCell sortDirection={sortConfig.direction}>
              <TableSortLabel
                active={sortConfig.key === 'upgradeTime'}
                direction={sortConfig.direction}
                onClick={() => requestSort('upgradeTime')}
              >
                Upgrade Time
              </TableSortLabel>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {sortedData.map((ae) => {
            const nextLevel: EntityLevel = ae.entity.levels
              .filter(el => el.level > ae.level)
              .sort((a, b) => a.level - b.level)[0]
            return (
              (
                <TableRow key={ae.id}>
                  <TableCell>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      <img
                        src={nextLevel.imgPath}
                        alt={`${ae.entity.name}-img`}
                        style={{
                          width: 40,
                          height: 40,
                          objectFit: 'contain',
                          borderRadius: 6,
                        }}
                      />
                      <Typography variant="body1" fontWeight="500">
                        {ae.entity.name}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Cost and Resource Icon */}
                  <TableCell>
                    <Box sx={{display: 'flex', alignItems: 'center', gap: 1}}>
                      <img
                        src={getResourceByType(nextLevel.resource)}
                        alt={`${ae.entity.name}-resource`}
                        style={{
                          width: 20,
                          height: 20,
                          objectFit: 'contain',
                        }}
                      />
                      <Typography variant="body2">
                        {nextLevel.cost.toLocaleString()}
                      </Typography>
                    </Box>
                  </TableCell>

                  {/* Upgrade Time */}
                  <TableCell align="center">
                    <Typography variant="body2">
                      {secondsToString(nextLevel.upgradeTime)}
                    </Typography>
                  </TableCell>
                </TableRow>
              )
            )
          })}
        </TableBody>
      </Table>
    </TableContainer>
  );
};

export default AccountEntitiesTable;
