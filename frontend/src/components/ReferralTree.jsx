import { useState } from "react";
import StateMessage from "./StateMessage";

const TreeNode = ({ node, depth = 0 }) => {
  const [expanded, setExpanded] = useState(depth < 1);
  const hasChildren = node.children && node.children.length > 0;

  return (
    <li className="relative my-1.5">
      <div className="flex items-center gap-2">
        {hasChildren ? (
          <button
            className="w-5 h-5 shrink-0 rounded-md border border-line bg-surface text-text-muted text-xs leading-none flex items-center justify-center"
            onClick={() => setExpanded((e) => !e)}
            aria-expanded={expanded}
            aria-label={expanded ? "Collapse" : "Expand"}
          >
            {expanded ? "−" : "+"}
          </button>
        ) : (
          <span className="w-5 h-5 shrink-0 flex items-center justify-center" aria-hidden="true">
            <span className="w-1.5 h-1.5 rounded-full bg-line" />
          </span>
        )}
        <div className="flex items-baseline gap-2 bg-[#FAFBFD] border border-line rounded-md px-3 py-1.5 text-[13.5px]">
          <span className="font-medium text-text">{node.fullName}</span>
          <span className="font-mono text-[11.5px] text-text-muted">{node.referralCode}</span>
        </div>
      </div>

      {hasChildren && expanded && (
        <ul className="list-none m-0 pl-[18px] ml-[22px] border-l border-dashed border-line">
          {node.children.map((child) => (
            <TreeNode key={child.id} node={child} depth={depth + 1} />
          ))}
        </ul>
      )}
    </li>
  );
};

const ReferralTree = ({ root }) => {
  if (!root || !root.children || root.children.length === 0) {
    return <StateMessage>No referrals yet. Share your referral code to build your downline.</StateMessage>;
  }

  return (
    <div className="bg-surface border border-line rounded-md px-6 py-[22px] shadow-[0_1px_2px_rgba(18,32,61,0.06),0_1px_12px_rgba(18,32,61,0.04)]">
      <ul className="list-none m-0 p-0">
        {root.children.map((child) => (
          <TreeNode key={child.id} node={child} depth={0} />
        ))}
      </ul>
    </div>
  );
};

export default ReferralTree;
