import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface SafeSequenceProps {
  sequence: number[];
}

const SafeSequence = ({ sequence }: SafeSequenceProps) => {
  return (
    <div className="space-y-10">
      <div>
        <h4 className="text-4xl md:text-5xl font-bold mb-10 text-center">Safe Execution Sequence</h4>
        <div className="flex flex-wrap items-center justify-center gap-6">
          {sequence.map((vmId, index) => (
            <div key={index} className="flex items-center gap-6">
              <Badge variant="default" className="text-4xl px-12 py-6 font-bold">
                VM{vmId}
              </Badge>
              {index < sequence.length - 1 && (
                <ArrowRight className="w-12 h-12 text-muted-foreground" />
              )}
            </div>
          ))}
        </div>
      </div>
      <p className="text-2xl md:text-3xl text-center text-muted-foreground font-semibold">
        All VMs can complete execution following this sequence without entering a deadlock state.
      </p>
    </div>
  );
};

export default SafeSequence;
