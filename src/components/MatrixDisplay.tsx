import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface MatrixDisplayProps {
  matrix: number[][];
  title?: string;
  vmLabels?: boolean;
  resourceLabels?: boolean;
}

const MatrixDisplay = ({ matrix, vmLabels, resourceLabels }: MatrixDisplayProps) => {
  if (!matrix || matrix.length === 0) {
    return <p className="text-muted-foreground">No data available</p>;
  }

  const cols = matrix[0]?.length || 0;

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
          {matrix.map((row, rowIndex) => (
            <TableRow key={rowIndex}>
              {vmLabels && (
                <TableCell className="font-medium">VM{rowIndex}</TableCell>
              )}
              {row.map((value, colIndex) => (
                <TableCell key={colIndex} className="text-center font-mono">
                  {value}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default MatrixDisplay;
