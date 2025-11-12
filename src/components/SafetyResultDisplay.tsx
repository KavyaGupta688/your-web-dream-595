import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle2, XCircle } from "lucide-react";
import SafeSequence from "./SafeSequence";

interface SafetyResultDisplayProps {
  safetyResult: { isSafe: boolean; sequence: number[] };
}

const SafetyResultDisplay = ({ safetyResult }: SafetyResultDisplayProps) => {
  return (
    <div className="w-full flex items-center justify-center py-20 px-4">
      <Card className={`w-full ${safetyResult.isSafe ? "border-green-500 border-8 shadow-2xl shadow-green-500/60" : "border-destructive border-8 shadow-2xl shadow-destructive/60"}`}>
        <CardHeader className="text-center space-y-12 py-16">
          <div className="flex justify-center">
            {safetyResult.isSafe ? (
              <CheckCircle2 className="w-56 h-56 text-green-500 animate-in zoom-in duration-500" />
            ) : (
              <XCircle className="w-56 h-56 text-destructive animate-in zoom-in duration-500" />
            )}
          </div>
          <CardTitle className="text-7xl md:text-8xl lg:text-9xl font-bold">
            {safetyResult.isSafe ? (
              <span className="text-green-500">System State: SAFE</span>
            ) : (
              <span className="text-destructive">System State: UNSAFE</span>
            )}
          </CardTitle>
          <CardDescription className="text-3xl md:text-4xl lg:text-5xl font-semibold">
            {safetyResult.isSafe 
              ? "The system can safely allocate resources without risk of deadlock"
              : "Warning: Current allocation may lead to deadlock"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-12 pb-16">
          {safetyResult.isSafe ? (
            <SafeSequence sequence={safetyResult.sequence} />
          ) : (
            <Alert variant="destructive" className="text-2xl border-4">
              <AlertDescription className="text-center py-12 font-bold">
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
