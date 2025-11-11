import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MatrixInputProps {
  matrix: (number | '')[][];
  onChange: (matrix: (number | '')[][]) => void;
  rows: number;
  cols: number;
  vmLabels?: boolean;
  resourceLabels?: boolean;
}

const MatrixInput = ({ matrix, onChange, rows, cols, vmLabels, resourceLabels }: MatrixInputProps) => {
  const handleChange = (row: number, col: number, value: string) => {
    const newMatrix = matrix.map(r => [...r]);
    // Allow temporary empty state for clearing
    newMatrix[row][col] = value === '' ? '' as any : (parseInt(value) || 0);
    onChange(newMatrix);
  };

  return (
    <div className="overflow-x-auto">
      <Table>
        {resourceLabels && (
          <TableHeader>
            <TableRow>
              {vmLabels && <TableHead className="w-24">VM</TableHead>}
              {Array.from({ length: cols }).map((_, i) => (
                <TableHead key={i} className="text-center">R{i}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
        )}
        <TableBody>
          {Array.from({ length: rows }).map((_, rowIndex) => (
            <TableRow key={rowIndex}>
              {vmLabels && (
                <TableCell className="font-medium">VM{rowIndex}</TableCell>
              )}
              {Array.from({ length: cols }).map((_, colIndex) => (
                <TableCell key={colIndex} className="p-2">
                  <Input
                    type="number"
                    min="0"
                    value={matrix[rowIndex]?.[colIndex] === '' ? '' : matrix[rowIndex]?.[colIndex] || 0}
                    onChange={(e) => handleChange(rowIndex, colIndex, e.target.value)}
                    className="w-20 text-center"
                  />
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatrixInput;
