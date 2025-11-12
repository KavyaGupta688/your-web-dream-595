import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import SafeSequence from "./SafeSequence";

interface SafetyResultDisplayProps {
  safetyResult: { isSafe: boolean; sequence: number[] };
}

const SafetyResultDisplay = ({ safetyResult }: SafetyResultDisplayProps) => {
  return (
    <div className="flex items-center justify-center py-12">
      <Card className={`w-full max-w-4xl ${safetyResult.isSafe ? "border-green-500 border-2 shadow-2xl shadow-green-500/30" : "border-destructive border-2 shadow-2xl shadow-destructive/30"}`}>
        <CardHeader className="text-center space-y-6 pb-8">
          <div className="flex justify-center">
            {safetyResult.isSafe ? (
              <CheckCircle2 className="w-24 h-24 text-green-500" />
            ) : (
              <XCircle className="w-24 h-24 text-destructive" />
            )}
          </div>
          <CardTitle className="text-5xl font-bold">
            {safetyResult.isSafe ? (
              <span className="text-green-500">System State: SAFE</span>
            ) : (
              <span className="text-destructive">System State: UNSAFE</span>
            )}
          </CardTitle>
          <CardDescription className="text-xl">
            {safetyResult.isSafe 
              ? "The system can safely allocate resources without risk of deadlock"
              : "Warning: Current allocation may lead to deadlock"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {safetyResult.isSafe ? (
            <SafeSequence sequence={safetyResult.sequence} />
          ) : (
            <Alert variant="destructive" className="text-lg">
              <AlertDescription className="text-center py-4">
                No safe sequence exists. The system may enter a deadlock state! 
                Please adjust the allocation or maximum matrices.
              </AlertDescription>
            </Alert>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default SafetyResultDisplay;
