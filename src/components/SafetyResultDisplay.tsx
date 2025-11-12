import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import SafeSequence from "./SafeSequence";

interface SafetyResultDisplayProps {
  safetyResult: { isSafe: boolean; sequence: number[] };
}

const SafetyResultDisplay = ({ safetyResult }: SafetyResultDisplayProps) => {
  return (
    <div className="w-full flex items-center justify-center py-16">
      <Card className={`w-full max-w-6xl ${safetyResult.isSafe ? "border-green-500 border-4 shadow-2xl shadow-green-500/50" : "border-destructive border-4 shadow-2xl shadow-destructive/50"}`}>
        <CardHeader className="text-center space-y-8 pb-12">
          <div className="flex justify-center">
            {safetyResult.isSafe ? (
              <CheckCircle2 className="w-40 h-40 text-green-500 animate-in zoom-in duration-500" />
            ) : (
              <XCircle className="w-40 h-40 text-destructive animate-in zoom-in duration-500" />
            )}
          </div>
          <CardTitle className="text-6xl md:text-7xl font-bold">
            {safetyResult.isSafe ? (
              <span className="text-green-500">System State: SAFE</span>
            ) : (
              <span className="text-destructive">System State: UNSAFE</span>
            )}
          </CardTitle>
          <CardDescription className="text-2xl md:text-3xl font-semibold">
            {safetyResult.isSafe 
              ? "The system can safely allocate resources without risk of deadlock"
              : "Warning: Current allocation may lead to deadlock"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {safetyResult.isSafe ? (
            <SafeSequence sequence={safetyResult.sequence} />
          ) : (
            <Alert variant="destructive" className="text-xl">
              <AlertDescription className="text-center py-8 font-semibold">
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
