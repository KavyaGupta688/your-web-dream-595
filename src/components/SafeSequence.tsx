import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface SafeSequenceProps {
  sequence: number[];
}

const SafeSequence = ({ sequence }: SafeSequenceProps) => {
  return (
    <div className="space-y-4">
      <div>
        <h4 className="text-sm font-medium mb-3">Safe Execution Sequence</h4>
        <div className="flex flex-wrap items-center gap-2">
          {sequence.map((vmId, index) => (
            <div key={index} className="flex items-center gap-2">
              <Badge variant="default" className="text-base px-4 py-2">
                VM{vmId}
              </Badge>
              {index < sequence.length - 1 && (
                <ArrowRight className="w-4 h-4 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-sm text-muted-foreground">
        All VMs can complete execution following this sequence without entering a deadlock state.
      </p>
    </div>
  );
};

export default SafeSequence;
