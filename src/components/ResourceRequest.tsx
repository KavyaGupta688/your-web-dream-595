import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, AlertTriangle } from "lucide-react";

interface ResourceRequestProps {
  numProcesses: number;
  numResources: number;
  available: number[];
  need: number[][];
  onRequest: (processId: number, request: number[]) => void;
  isSafe: boolean;
}

const ResourceRequest = ({
  numProcesses,
  numResources,
  available,
  need,
  onRequest,
  isSafe,
}: ResourceRequestProps) => {
  const [selectedVM, setSelectedVM] = useState<number>(0);
  const [request, setRequest] = useState<(number | '')[]>(Array(numResources).fill(0));

  const handleRequest = () => {
    // Convert any empty strings to 0 before submitting
    const cleanedRequest = request.map(r => typeof r === 'string' ? 0 : r);
    onRequest(selectedVM, cleanedRequest);
    setRequest(Array(numResources).fill(0));
  };

  const handleRequestChange = (index: number, value: string) => {
    const newRequest = [...request];
    newRequest[index] = value === '' ? '' as any : (parseInt(value) || 0);
    setRequest(newRequest);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Resource Request Simulator</CardTitle>
        <CardDescription>
          Test if a resource request can be safely granted without causing deadlock
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {!isSafe && (
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              System is currently in an UNSAFE state. Fix the current allocation before making new requests.
            </AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label>Select Virtual Machine</Label>
            <Select
              value={selectedVM.toString()}
              onValueChange={(value) => setSelectedVM(parseInt(value))}
              disabled={!isSafe}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a VM" />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: numProcesses }).map((_, i) => (
                  <SelectItem key={i} value={i.toString()}>
                    VM{i}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {Array.from({ length: numResources }).map((_, i) => (
              <div key={i} className="space-y-2">
                <Label htmlFor={`resource-${i}`}>Resource R{i}</Label>
                <Input
                  id={`resource-${i}`}
                  type="number"
                  min="0"
                  max={need[selectedVM]?.[i] || 0}
                  value={request[i] === '' ? '' : request[i]}
                  onChange={(e) => handleRequestChange(i, e.target.value)}
                  disabled={!isSafe}
                />
                <p className="text-xs text-muted-foreground">
                  Max: {need[selectedVM]?.[i] || 0} | Available: {available[i]}
                </p>
              </div>
            ))}
          </div>

          <Button 
            onClick={handleRequest} 
            className="w-full" 
            disabled={!isSafe || request.every(r => r === 0 || r === '')}
          >
            Submit Resource Request
          </Button>
          {request.every(r => r === 0 || r === '') && isSafe && (
            <p className="text-xs text-muted-foreground text-center">
              Enter resource amounts above to submit a request
            </p>
          )}
        </div>

        <div className="pt-4 border-t space-y-3">
          <h4 className="text-sm font-medium">Current System Status</h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm">System State</span>
                  <div className="flex items-center gap-2">
                    {isSafe ? (
                      <>
                        <CheckCircle2 className="w-4 h-4 text-green-500" />
                        <span className="text-sm font-medium text-green-500">SAFE</span>
                      </>
                    ) : (
                      <>
                        <AlertTriangle className="w-4 h-4 text-destructive" />
                        <span className="text-sm font-medium text-destructive">UNSAFE</span>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-muted/50">
              <CardContent className="pt-6">
                <div className="space-y-2">
                  <span className="text-sm font-medium">Available Resources</span>
                  <div className="flex gap-2">
                    {available.map((val, i) => (
                      <div key={i} className="text-center">
                        <div className="text-xs text-muted-foreground">R{i}</div>
                        <div className="text-sm font-mono font-medium">{val}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default ResourceRequest;
