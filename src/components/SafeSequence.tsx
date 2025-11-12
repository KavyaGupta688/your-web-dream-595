import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface SafeSequenceProps {
  sequence: number[];
}

const SafeSequence = ({ sequence }: SafeSequenceProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h4 className="text-2xl font-semibold mb-6 text-center">Safe Execution Sequence</h4>
        <div className="flex flex-wrap items-center justify-center gap-4">
          {sequence.map((vmId, index) => (
            <div key={index} className="flex items-center gap-4">
              <Badge variant="default" className="text-2xl px-8 py-4 font-bold">
                VM{vmId}
              </Badge>
              {index < sequence.length - 1 && (
                <ArrowRight className="w-8 h-8 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-lg text-center text-muted-foreground font-medium">
        All VMs can complete execution following this sequence without entering a deadlock state.
      </p>
    </div>
  );
};

export default SafeSequence;
