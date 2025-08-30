"use client";

import { type ReactNode, useCallback, useMemo, useState, useEffect } from "react";
import { useAccount } from "wagmi";
import {
  Transaction,
  TransactionButton,
  TransactionToast,
  TransactionToastAction,
  TransactionToastIcon,
  TransactionToastLabel,
  TransactionError,
  TransactionResponse,
  TransactionStatusAction,
  TransactionStatusLabel,
  TransactionStatus,
} from "@coinbase/onchainkit/transaction";
import { useNotification, useMiniKit } from "@coinbase/onchainkit/minikit";

type ButtonProps = {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
  type?: "button" | "submit" | "reset";
  icon?: ReactNode;
}

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  onClick,
  disabled = false,
  type = "button",
  icon,
}: ButtonProps) {
  const baseClasses =
    "inline-flex items-center justify-center font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#0052FF] disabled:opacity-50 disabled:pointer-events-none";

  const variantClasses = {
    primary:
      "bg-[var(--app-accent)] hover:bg-[var(--app-accent-hover)] text-[var(--app-background)]",
    secondary:
      "bg-[var(--app-gray)] hover:bg-[var(--app-gray-dark)] text-[var(--app-foreground)]",
    outline:
      "border border-[var(--app-accent)] hover:bg-[var(--app-accent-light)] text-[var(--app-accent)]",
    ghost:
      "hover:bg-[var(--app-accent-light)] text-[var(--app-foreground-muted)]",
  };

  const sizeClasses = {
    sm: "text-xs px-2.5 py-1.5 rounded-md",
    md: "text-sm px-4 py-2 rounded-lg",
    lg: "text-base px-6 py-3 rounded-lg",
  };

  return (
    <button
      type={type}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
      onClick={onClick}
      disabled={disabled}
    >
      {icon && <span className="flex items-center mr-2">{icon}</span>}
      {children}
    </button>
  );
}

type CardProps = {
  title?: string;
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}

function Card({
  title,
  children,
  className = "",
  onClick,
}: CardProps) {
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (onClick && (e.key === "Enter" || e.key === " ")) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      className={`bg-[var(--app-card-bg)] backdrop-blur-md rounded-xl shadow-lg border border-[var(--app-card-border)] overflow-hidden transition-all hover:shadow-xl ${className} ${onClick ? "cursor-pointer" : ""}`}
      onClick={onClick}
      onKeyDown={onClick ? handleKeyDown : undefined}
      tabIndex={onClick ? 0 : undefined}
      role={onClick ? "button" : undefined}
    >
      {title && (
        <div className="px-5 py-3 border-b border-[var(--app-card-border)]">
          <h3 className="text-lg font-medium text-[var(--app-foreground)]">
            {title}
          </h3>
        </div>
      )}
      <div className="p-5">{children}</div>
    </div>
  );
}

type FeaturesProps = {
  setActiveTab: (tab: string) => void;
};

export function Features({ setActiveTab }: FeaturesProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="Key Features">
        <ul className="space-y-3 mb-4">
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Minimalistic and beautiful UI design
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Responsive layout for all devices
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              Dark mode support
            </span>
          </li>
          <li className="flex items-start">
            <Icon name="check" className="text-[var(--app-accent)] mt-1 mr-2" />
            <span className="text-[var(--app-foreground-muted)]">
              OnchainKit integration
            </span>
          </li>
        </ul>
        <Button variant="outline" onClick={() => setActiveTab("home")}>
          Back to Home
        </Button>
      </Card>
    </div>
  );
}

type HomeProps = {
  setActiveTab: (tab: string) => void;
};

export function Home({ setActiveTab }: HomeProps) {
  return (
    <div className="space-y-6 animate-fade-in">
      <Card title="My First Mini App">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          This is a minimalistic Mini App built with OnchainKit components.
        </p>
        <Button
          onClick={() => setActiveTab("features")}
          icon={<Icon name="arrow-right" size="sm" />}
        >
          Explore Features
        </Button>
      </Card>

      <VotingComponent />

      <TransactionCard />
    </div>
  );
}

type IconProps = {
  name: "heart" | "star" | "check" | "plus" | "arrow-right";
  size?: "sm" | "md" | "lg";
  className?: string;
}

export function Icon({ name, size = "md", className = "" }: IconProps) {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-5 h-5",
    lg: "w-6 h-6",
  };

  const icons = {
    heart: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Heart</title>
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
    star: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Star</title>
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
    check: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Check</title>
        <polyline points="20 6 9 17 4 12" />
      </svg>
    ),
    plus: (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Plus</title>
        <line x1="12" y1="5" x2="12" y2="19" />
        <line x1="5" y1="12" x2="19" y2="12" />
      </svg>
    ),
    "arrow-right": (
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <title>Arrow Right</title>
        <line x1="5" y1="12" x2="19" y2="12" />
        <polyline points="12 5 19 12 12 19" />
      </svg>
    ),
  };

  return (
    <span className={`inline-block ${sizeClasses[size]} ${className}`}>
      {icons[name]}
    </span>
  );
}

type VoteOption = {
  id: number;
  text: string;
  votes: number;
  voters: number[]; // Array of FIDs who voted for this option
}

function VotingComponent() {
  const { context } = useMiniKit();
  const sendNotification = useNotification();
  
  // Initialize voting options with workshop-relevant choices
  const [voteOptions, setVoteOptions] = useState<VoteOption[]>([
    { id: 1, text: "🍕 Build a Pizza Ordering DApp", votes: 0, voters: [] },
    { id: 2, text: "🎮 Create a Mini Game Frame", votes: 0, voters: [] },
    { id: 3, text: "💰 Make a Tip Jar for Creators", votes: 0, voters: [] },
    { id: 4, text: "🎨 Build an NFT Gallery", votes: 0, voters: [] },
  ]);

  // Get user's FID for vote tracking - use stable ID for development to prevent hydration issues
  const [devFid, setDevFid] = useState(999999); // Static fallback for SSR
  const [isClient, setIsClient] = useState(false);
  
  useEffect(() => {
    // Only run on client side to prevent hydration mismatch
    setIsClient(true);
    if (!context?.user?.fid) {
      setDevFid(Math.floor(Math.random() * 1000000));
    }
  }, [context?.user?.fid]);

  const userFid = context?.user?.fid || devFid;
  const devMode = !context?.user?.fid; // Track if we're in dev mode

  // Check if user has already voted
  const userHasVoted = useMemo(() => {
    if (!userFid) return false;
    return voteOptions.some(option => option.voters.includes(userFid));
  }, [voteOptions, userFid]);

  const handleVote = useCallback(async (optionId: number) => {
    console.log("Vote button clicked for option:", optionId);
    console.log("User FID:", userFid);
    console.log("Already voted:", userHasVoted);

    if (userHasVoted && !devMode) {
      console.log("User has already voted and not in dev mode");
      alert("You have already voted!");
      return;
    }

    // Update vote counts
    setVoteOptions(prevOptions =>
      prevOptions.map(option =>
        option.id === optionId
          ? {
              ...option,
              votes: option.votes + 1,
              voters: [...option.voters, userFid]
            }
          : option
      )
    );

    // Send notification about the vote
    const selectedOption = voteOptions.find(opt => opt.id === optionId);
    if (selectedOption) {
      try {
        if (devMode) {
          // In dev mode, show alert instead of notification
          alert(`Vote Recorded! 🗳️\nYou voted for: ${selectedOption.text}`);
        } else {
          await sendNotification({
            title: "Vote Recorded! 🗳️",
            body: `You voted for: ${selectedOption.text}`,
          });
        }

        // Send milestone notifications for group engagement  
        const currentTotalVotes = voteOptions.reduce((sum, opt) => sum + opt.votes, 0);
        const newTotalVotes = currentTotalVotes + 1;
        if (newTotalVotes === 5) {
          if (devMode) {
            alert(`🎉 5 Votes Reached!\nWorkshop voting is heating up! Current leader: ${selectedOption.text}`);
          } else {
            await sendNotification({
              title: "🎉 5 Votes Reached!",
              body: "Workshop voting is heating up! Current leader: " + selectedOption.text,
            });
          }
        } else if (newTotalVotes === 10) {
          if (devMode) {
            alert("🚀 10 Votes Milestone!\nAmazing participation! This will be an epic workshop!");
          } else {
            await sendNotification({
              title: "🚀 10 Votes Milestone!",
              body: "Amazing participation! This will be an epic workshop!",
            });
          }
        }
      } catch (error) {
        console.error("Notification error:", error);
        alert(`Vote recorded for: ${selectedOption.text}`);
      }
    }
  }, [userFid, userHasVoted, voteOptions, sendNotification, devMode]);

  // Calculate total votes
  const totalVotes = voteOptions.reduce((sum, option) => sum + option.votes, 0);

  return (
    <Card title="🗳️ Workshop Project Vote">
      <div className="space-y-4">
        {isClient && devMode && (
          <div className="bg-yellow-100 border border-yellow-300 rounded-lg p-3 text-sm text-yellow-800">
            <strong>🛠️ Dev Mode:</strong> Using fallback FID ({userFid}). Notifications will show as alerts.
          </div>
        )}
        <p className="text-[var(--app-foreground-muted)] text-sm">
          Vote for your favorite workshop project idea! {userHasVoted ? "✅ You've voted!" : "Choose one option:"}
        </p>

        <div className="space-y-3">
          {voteOptions.map((option) => {
            const percentage = totalVotes > 0 ? (option.votes / totalVotes) * 100 : 0;
            const userVotedForThis = userFid && option.voters.includes(userFid);
            
            return (
              <div key={option.id} className="space-y-2">
                <div className="flex items-center justify-between">
                  <Button
                    variant={userVotedForThis ? "primary" : "outline"}
                    size="sm"
                    onClick={() => handleVote(option.id)}
                    disabled={userHasVoted}
                    className="flex-1 justify-start text-left"
                    icon={userVotedForThis ? <Icon name="check" size="sm" /> : <Icon name="plus" size="sm" />}
                  >
                    <span className="truncate">{option.text}</span>
                  </Button>
                  <span className="text-sm text-[var(--app-foreground-muted)] ml-2 min-w-0">
                    {option.votes} votes
                  </span>
                </div>
                
                {/* Progress bar */}
                <div className="h-2 bg-[var(--app-gray)] rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-[var(--app-accent)] transition-all duration-500 ease-out"
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        <div className="pt-3 border-t border-[var(--app-card-border)]">
          <div className="flex items-center justify-between text-sm">
            <span className="text-[var(--app-foreground-muted)]">
              Total votes: {totalVotes}
            </span>
            {userHasVoted && (
              <span className="text-[var(--app-accent)] font-medium">
                Thanks for voting! 🎉
              </span>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}


function TransactionCard() {
  const { address } = useAccount();

  // Example transaction call - sending 0 ETH to self
  const calls = useMemo(() => address
    ? [
        {
          to: address,
          data: "0x" as `0x${string}`,
          value: BigInt(0),
        },
      ]
    : [], [address]);

  const sendNotification = useNotification();

  const handleSuccess = useCallback(async (response: TransactionResponse) => {
    const transactionHash = response.transactionReceipts[0].transactionHash;

    console.log(`Transaction successful: ${transactionHash}`);

    await sendNotification({
      title: "Congratulations!",
      body: `You sent your a transaction, ${transactionHash}!`,
    });
  }, [sendNotification]);

  return (
    <Card title="Make Your First Transaction">
      <div className="space-y-4">
        <p className="text-[var(--app-foreground-muted)] mb-4">
          Experience the power of seamless sponsored transactions with{" "}
          <a
            href="https://onchainkit.xyz"
            target="_blank"
            rel="noopener noreferrer"
            className="text-[#0052FF] hover:underline"
          >
            OnchainKit
          </a>
          .
        </p>

        <div className="flex flex-col items-center">
          {address ? (
            <Transaction
              calls={calls}
              onSuccess={handleSuccess}
              onError={(error: TransactionError) =>
                console.error("Transaction failed:", error)
              }
            >
              <TransactionButton className="text-white text-md" />
              <TransactionStatus>
                <TransactionStatusAction />
                <TransactionStatusLabel />
              </TransactionStatus>
              <TransactionToast className="mb-4">
                <TransactionToastIcon />
                <TransactionToastLabel />
                <TransactionToastAction />
              </TransactionToast>
            </Transaction>
          ) : (
            <p className="text-yellow-400 text-sm text-center mt-2">
              Connect your wallet to send a transaction
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
