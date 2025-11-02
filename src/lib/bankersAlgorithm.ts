export const calculateNeed = (maximum: number[][], allocation: number[][]): number[][] => {
  const need: number[][] = [];
  for (let i = 0; i < maximum.length; i++) {
    need[i] = [];
    for (let j = 0; j < maximum[i].length; j++) {
      need[i][j] = maximum[i][j] - allocation[i][j];
    }
  }
  return need;
};

export const checkSafety = (
  available: number[],
  maximum: number[][],
  allocation: number[][],
  need: number[][],
  numProcesses: number,
  numResources: number
): { isSafe: boolean; sequence: number[] } => {
  const work = [...available];
  const finish = Array(numProcesses).fill(false);
  const safeSequence: number[] = [];

  let count = 0;
  while (count < numProcesses) {
    let found = false;
    
    for (let i = 0; i < numProcesses; i++) {
      if (!finish[i]) {
        let canAllocate = true;
        
        for (let j = 0; j < numResources; j++) {
          if (need[i][j] > work[j]) {
            canAllocate = false;
            break;
          }
        }
        
        if (canAllocate) {
          for (let j = 0; j < numResources; j++) {
            work[j] += allocation[i][j];
          }
          
          safeSequence.push(i);
          finish[i] = true;
          found = true;
          count++;
        }
      }
    }
    
    if (!found) {
      return { isSafe: false, sequence: [] };
    }
  }
  
  return { isSafe: true, sequence: safeSequence };
};

export const requestResources = (
  processId: number,
  request: number[],
  available: number[],
  maximum: number[][],
  allocation: number[][],
  need: number[][],
  numProcesses: number,
  numResources: number
): {
  granted: boolean;
  message?: string;
  newAvailable: number[];
  newAllocation: number[][];
  newNeed: number[][];
  safetyCheck: { isSafe: boolean; sequence: number[] };
} => {
  // Check if request is valid
  for (let i = 0; i < numResources; i++) {
    if (request[i] > need[processId][i]) {
      return {
        granted: false,
        message: `Request exceeds maximum need for VM ${processId}`,
        newAvailable: available,
        newAllocation: allocation,
        newNeed: need,
        safetyCheck: { isSafe: false, sequence: [] },
      };
    }
    
    if (request[i] > available[i]) {
      return {
        granted: false,
        message: `Resources not available - VM ${processId} must wait`,
        newAvailable: available,
        newAllocation: allocation,
        newNeed: need,
        safetyCheck: { isSafe: false, sequence: [] },
      };
    }
  }

  // Pretend to allocate resources
  const newAvailable = [...available];
  const newAllocation = allocation.map(row => [...row]);
  const newNeed = need.map(row => [...row]);

  for (let i = 0; i < numResources; i++) {
    newAvailable[i] -= request[i];
    newAllocation[processId][i] += request[i];
    newNeed[processId][i] -= request[i];
  }

  // Check if this new state is safe
  const safetyCheck = checkSafety(newAvailable, maximum, newAllocation, newNeed, numProcesses, numResources);

  if (safetyCheck.isSafe) {
    return {
      granted: true,
      newAvailable,
      newAllocation,
      newNeed,
      safetyCheck,
    };
  } else {
    return {
      granted: false,
      message: "Request would lead to unsafe state - denied",
      newAvailable: available,
      newAllocation: allocation,
      newNeed: need,
      safetyCheck: { isSafe: false, sequence: [] },
    };
  }
};
