import React, { useState } from 'react';
import { PalData } from '../../data/pals';
import { PathStep } from '../../utils/breedingPathfinder';
import Image from 'next/image';
import { ChevronDown, ChevronUp } from 'lucide-react';

interface BreedingTreeProps {
  steps: PathStep[];
  targetKey: string;
}

const PalNodeCard = ({
    pal,
    isResult,
    isLeaf,
    onToggle,
    isExpanded,
    hasParents
}: {
    pal: PalData;
    isResult?: boolean;
    isLeaf?: boolean;
    onToggle?: () => void;
    isExpanded?: boolean;
    hasParents?: boolean;
}) => {
  return (
    <div
        className={`
            relative flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all w-32 md:w-40 z-20 group
            ${isResult
                ? 'bg-sky-900/40 border-sky-500 shadow-[0_0_15px_rgba(14,165,233,0.3)]'
                : isLeaf
                ? 'bg-slate-800 border-green-700/50' // Base Pals get a subtle green tint border
                : 'bg-slate-800/90 border-slate-600'
            }
        `}
        title={isLeaf ? "You own this Pal" : "Needs breeding"}
    >
      {/* Image Placeholder */}
      <div className="w-12 h-12 md:w-16 md:h-16 mb-2 rounded-full overflow-hidden bg-slate-900 border border-slate-700 flex items-center justify-center relative shadow-inner">
        {pal.image ? (
            <Image
                src={pal.image}
                alt={pal.name}
                fill
                className="object-cover"
                onError={(e) => {
                    e.currentTarget.style.display = 'none';
                }}
            />
        ) : null}
        <span className="text-2xl opacity-50 absolute">🐾</span>
      </div>

      <div className="text-center w-full">
        <div className={`font-bold text-xs md:text-sm leading-tight truncate px-1 ${isResult ? 'text-sky-300' : 'text-slate-200'}`}>
          {pal.name}
        </div>
        {isLeaf ? (
            <div className="text-[10px] uppercase tracking-wider text-green-500/80 mt-1 font-bold">In Box</div>
        ) : (
            <div className="text-[10px] uppercase tracking-wider text-slate-500 mt-1 font-bold">Breed</div>
        )}
      </div>

      {/* Expand/Collapse Handle */}
      {hasParents && (
          <button
            onClick={(e) => {
                e.stopPropagation();
                onToggle?.();
            }}
            className="absolute -top-3 left-1/2 -translate-x-1/2 bg-slate-700 hover:bg-sky-600 text-slate-300 hover:text-white rounded-full p-1 border border-slate-600 transition-colors shadow-sm z-30"
            title={isExpanded ? "Collapse Parents" : "Show Parents"}
          >
            {isExpanded ? <ChevronDown size={12} /> : <ChevronUp size={12} />}
          </button>
      )}
    </div>
  );
};

const TreeNode = ({ palKey, steps, depth = 0 }: { palKey: string; steps: PathStep[], depth?: number }) => {
  // Find the step that created this Pal
  const step = steps.find((s) => s.result.key === palKey);
  const [isExpanded, setIsExpanded] = useState(true);

  // If no step found, this is a base pal (leaf node)
  if (!step) {
    // Determine Pal Data from context (parent pointers) or global lookup?
    // Since we don't have global lookup easily here without props, we rely on the fact that
    // this TreeNode was called by a parent who had the PalData.
    // Wait, the parent passed `palKey`. We need to find the PalData.
    // We can look it up in `steps` parents.
    let palData: PalData | undefined;
    for (const s of steps) {
        if (s.result.key === palKey) palData = s.result;
        if (s.parent1?.key === palKey) palData = s.parent1;
        if (s.parent2?.key === palKey) palData = s.parent2;
        if (palData) break;
    }

    // Fallback if not found in steps (e.g. root target if steps empty? unlikely)
    if (!palData) return null;

    return (
        <div className="flex flex-col items-center pt-4">
            <PalNodeCard pal={palData} isLeaf />
        </div>
    );
  }

  return (
    <div className="flex flex-col items-center relative">

      {/* Parents Container - Rendered ABOVE the child */}
      {/* We use flex-col-reverse for the whole tree, so this is actually at the 'top' visually if we look at the code structure?
          No, the code renders: Parents -> Connector -> Child.
          So visually:
             [P1]   [P2]
               \     /
                [Child]
      */}

      <div className={`
            transition-all duration-300 ease-in-out overflow-hidden
            ${isExpanded ? 'opacity-100 max-h-[2000px] mb-4' : 'opacity-0 max-h-0 mb-0'}
      `}>
          <div className="flex gap-4 md:gap-12 relative items-end pb-4">

            {/* Horizontal Line connecting parents */}
            {/* We need a line spanning from center of P1 to center of P2 */}
            {/* It's hard to do perfectly with just CSS relative to container width.
                Instead, each parent has a "tail" down, and we join them.
            */}

            {step.parent1 && (
                <div className="flex flex-col items-center relative">
                    <TreeNode palKey={step.parent1.key} steps={steps} depth={depth + 1} />
                    {/* Connector line logic: The child handles the line UP to parents?
                        Or parents handle line DOWN to child?
                        Here: Parents -> Connector -> Child.
                    */}
                    {/* Visual Line from P1 bottom center to some middle point */}
                    <div className="absolute -bottom-4 right-1/2 w-full h-4 border-r-2 border-b-2 border-slate-600 rounded-br-xl translate-x-[2px]"></div>
                </div>
            )}

            {step.parent2 && (
                <div className="flex flex-col items-center relative">
                    <TreeNode palKey={step.parent2.key} steps={steps} depth={depth + 1} />
                    {/* Visual Line from P2 bottom center to some middle point */}
                    <div className="absolute -bottom-4 left-1/2 w-full h-4 border-l-2 border-b-2 border-slate-600 rounded-bl-xl -translate-x-[2px]"></div>
                </div>
            )}

          </div>
      </div>

      {/* Vertical Connector to Child */}
      {isExpanded && (
          <div className="h-6 w-0.5 bg-slate-600 -mt-4 mb-0 z-0"></div>
      )}

      {/* The Node Itself */}
      <PalNodeCard
        pal={step.result}
        isResult={depth === 0}
        onToggle={() => setIsExpanded(!isExpanded)}
        isExpanded={isExpanded}
        hasParents={true}
      />

    </div>
  );
};

export const BreedingTree = ({ steps, targetKey }: BreedingTreeProps) => {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="overflow-auto py-12 px-4 cursor-grab active:cursor-grabbing bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:16px_16px]">
      <div className="min-w-max flex justify-center transform scale-90 origin-top">
        <TreeNode palKey={targetKey} steps={steps} />
      </div>
    </div>
  );
};
