import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle, Cloud, Server } from "lucide-react";
import { toast } from "sonner";
import MatrixInput from "@/components/MatrixInput";
import MatrixDisplay from "@/components/MatrixDisplay";
import SafeSequence from "@/components/SafeSequence";
import ResourceRequest from "@/components/ResourceRequest";
import { calculateNeed, checkSafety, requestResources } from "@/lib/bankersAlgorithm";

const Index = () => {
  const [numProcesses, setNumProcesses] = useState(5);
  const [numResources, setNumResources] = useState(3);
  const [available, setAvailable] = useState<number[]>([3, 3, 2]);
  const [maximum, setMaximum] = useState<number[][]>([
    [7, 5, 3],
    [3, 2, 2],
    [9, 0, 2],
    [2, 2, 2],
    [4, 3, 3],
  ]);
  const [allocation, setAllocation] = useState<number[][]>([
    [0, 1, 0],
    [2, 0, 0],
    [3, 0, 2],
    [2, 1, 1],
    [0, 0, 2],
  ]);
  const [need, setNeed] = useState<number[][]>([]);
  const [safetyResult, setSafetyResult] = useState<{ isSafe: boolean; sequence: number[] } | null>(null);
  const [initialized, setInitialized] = useState(false);

  const handleInitialize = () => {
    const newAvailable = Array(numResources).fill(0);
    const newMaximum = Array(numProcesses).fill(null).map(() => Array(numResources).fill(0));
    const newAllocation = Array(numProcesses).fill(null).map(() => Array(numResources).fill(0));
    
    setAvailable(newAvailable);
    setMaximum(newMaximum);
    setAllocation(newAllocation);
    setInitialized(true);
    setSafetyResult(null);
    toast.success("System initialized! Please enter the resource values.");
  };

  const handleCheckSafety = () => {
    const calculatedNeed = calculateNeed(maximum, allocation);
    setNeed(calculatedNeed);
    
    const result = checkSafety(available, maximum, allocation, calculatedNeed, numProcesses, numResources);
    setSafetyResult(result);
    
    if (result.isSafe) {
      toast.success("System is in SAFE state!");
    } else {
      toast.error("System is in UNSAFE state - Deadlock possible!");
    }
  };

  const handleResourceRequest = (processId: number, request: number[]) => {
    const result = requestResources(
      processId,
      request,
      available,
      maximum,
      allocation,
      need,
      numProcesses,
      numResources
    );

    if (result.granted) {
      setAvailable(result.newAvailable);
      setAllocation(result.newAllocation);
      setNeed(result.newNeed);
      setSafetyResult(result.safetyCheck);
      toast.success(`Request granted! System remains safe.`);
    } else {
      toast.error(result.message || "Request denied - Would lead to unsafe state!");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/5">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-12">
          <div className="flex items-center justify-center gap-3 mb-4">
            <Cloud className="w-12 h-12 text-primary" />
            <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
              Cloud VM Resource Allocator
            </h1>
          </div>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Deadlock Avoidance using Banker's Algorithm for Cloud Virtual Machines
          </p>
        </header>

        <Tabs defaultValue="setup" className="space-y-6">
          <TabsList className="grid w-full max-w-md mx-auto grid-cols-3">
            <TabsTrigger value="setup">Setup</TabsTrigger>
            <TabsTrigger value="matrices">Matrices</TabsTrigger>
            <TabsTrigger value="request">Request</TabsTrigger>
          </TabsList>

          <TabsContent value="setup" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Server className="w-5 h-5" />
                  System Configuration
                </CardTitle>
                <CardDescription>
                  Configure the number of VMs and resource types for your cloud environment
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="numProcesses">Number of VMs (Processes)</Label>
                    <Input
                      id="numProcesses"
                      type="number"
                      min="1"
                      max="10"
                      value={numProcesses}
                      onChange={(e) => setNumProcesses(e.target.value === '' ? 1 : (parseInt(e.target.value) || 1))}
                      disabled={initialized}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="numResources">Number of Resource Types</Label>
                    <Input
                      id="numResources"
                      type="number"
                      min="1"
                      max="10"
                      value={numResources}
                      onChange={(e) => setNumResources(e.target.value === '' ? 1 : (parseInt(e.target.value) || 1))}
                      disabled={initialized}
                    />
                  </div>
                </div>

                {!initialized ? (
                  <Button onClick={handleInitialize} className="w-full" size="lg">
                    Initialize System
                  </Button>
                ) : (
                  <>
                    <div className="space-y-4">
                      <div>
                        <Label className="mb-3 block">Available Resources</Label>
                        <MatrixInput
                          matrix={[available]}
                          onChange={(newMatrix) => setAvailable(newMatrix[0])}
                          rows={1}
                          cols={numResources}
                          resourceLabels={true}
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">Maximum Matrix (Max resource need per VM)</Label>
                        <MatrixInput
                          matrix={maximum}
                          onChange={setMaximum}
                          rows={numProcesses}
                          cols={numResources}
                          vmLabels={true}
                          resourceLabels={true}
                        />
                      </div>

                      <div>
                        <Label className="mb-3 block">Allocation Matrix (Currently allocated)</Label>
                        <MatrixInput
                          matrix={allocation}
                          onChange={setAllocation}
                          rows={numProcesses}
                          cols={numResources}
                          vmLabels={true}
                          resourceLabels={true}
                        />
                      </div>
                    </div>

                    <Button onClick={handleCheckSafety} className="w-full" size="lg">
                      Check Safety & Calculate Need
                    </Button>

                    <Button 
                      onClick={() => {
                        setInitialized(false);
                        setSafetyResult(null);
                        setNeed([]);
                        toast.info("System reset");
                      }} 
                      variant="outline" 
                      className="w-full"
                    >
                      Reset System
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="matrices" className="space-y-6">
            {!initialized ? (
              <Alert>
                <AlertDescription>
                  Please initialize the system in the Setup tab first.
                </AlertDescription>
              </Alert>
            ) : (
              <>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>Available Resources</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MatrixDisplay matrix={[available]} title="Available" resourceLabels={true} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Maximum Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MatrixDisplay matrix={maximum} title="Maximum" vmLabels={true} resourceLabels={true} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Allocation Matrix</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <MatrixDisplay matrix={allocation} title="Allocation" vmLabels={true} resourceLabels={true} />
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle>Need Matrix</CardTitle>
                      <CardDescription>Need = Maximum - Allocation</CardDescription>
                    </CardHeader>
                    <CardContent>
                      {need.length > 0 ? (
                        <MatrixDisplay matrix={need} title="Need" vmLabels={true} resourceLabels={true} />
                      ) : (
                        <p className="text-muted-foreground">Click "Check Safety" to calculate</p>
                      )}
                    </CardContent>
                  </Card>
                </div>

                {safetyResult && (
                  <div className="flex items-center justify-center py-8">
                    <Card className={`w-full max-w-3xl ${safetyResult.isSafe ? "border-green-500 border-2 shadow-lg shadow-green-500/20" : "border-destructive border-2 shadow-lg shadow-destructive/20"}`}>
                      <CardHeader className="text-center space-y-4 pb-6">
                        <div className="flex justify-center">
                          {safetyResult.isSafe ? (
                            <CheckCircle2 className="w-16 h-16 text-green-500" />
                          ) : (
                            <XCircle className="w-16 h-16 text-destructive" />
                          )}
                        </div>
                        <CardTitle className="text-3xl font-bold">
                          {safetyResult.isSafe ? (
                            <span className="text-green-500">System State: SAFE</span>
                          ) : (
                            <span className="text-destructive">System State: UNSAFE</span>
                          )}
                        </CardTitle>
                        <CardDescription className="text-base">
                          {safetyResult.isSafe 
                            ? "The system can safely allocate resources without risk of deadlock"
                            : "Warning: Current allocation may lead to deadlock"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        {safetyResult.isSafe ? (
                          <SafeSequence sequence={safetyResult.sequence} />
                        ) : (
                          <Alert variant="destructive" className="text-base">
                            <AlertDescription className="text-center py-2">
                              No safe sequence exists. The system may enter a deadlock state! 
                              Please adjust the allocation or maximum matrices.
                            </AlertDescription>
                          </Alert>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                )}
              </>
            )}
          </TabsContent>

          <TabsContent value="request" className="space-y-6">
            {!initialized ? (
              <Alert>
                <AlertDescription>
                  Please initialize the system and check safety first.
                </AlertDescription>
              </Alert>
            ) : !safetyResult ? (
              <Alert>
                <AlertDescription>
                  Please check system safety in the Setup tab before making resource requests.
                </AlertDescription>
              </Alert>
            ) : (
              <ResourceRequest
                numProcesses={numProcesses}
                numResources={numResources}
                available={available}
                need={need}
                onRequest={handleResourceRequest}
                isSafe={safetyResult.isSafe}
              />
            )}
          </TabsContent>
        </Tabs>

        <Card className="mt-8 bg-primary/5 border-primary/20">
          <CardHeader>
            <CardTitle>About Banker's Algorithm</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3 text-sm text-muted-foreground">
            <p>
              The Banker's Algorithm is a deadlock avoidance algorithm developed by Edsger Dijkstra. 
              It tests for safety by simulating the allocation of predetermined maximum possible amounts 
              of all resources, and then makes a "safe state" check to test for possible deadlock conditions.
            </p>
            <p>
              In cloud computing, this algorithm helps efficiently allocate resources (CPU, memory, storage) 
              among Virtual Machines while preventing deadlock situations.
            </p>
            <div className="flex flex-wrap gap-2 pt-2">
              <Badge variant="secondary">Deadlock Avoidance</Badge>
              <Badge variant="secondary">Safe State Detection</Badge>
              <Badge variant="secondary">Resource Management</Badge>
              <Badge variant="secondary">Cloud Computing</Badge>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Index;
