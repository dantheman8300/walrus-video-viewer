import { ConnectModal, useCurrentAccount, useDisconnectWallet, useResolveSuiNSName } from "@mysten/dapp-kit"
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator  } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Trash, ArrowUpRight, Copy, Upload, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

export function ConnectWalletButton({ fullWidth = false }: { fullWidth?: boolean }) {
  const navigate = useNavigate();
  const account = useCurrentAccount();
  const { data: suiNSName } = useResolveSuiNSName(account?.address);
  const { mutate: disconnect } = useDisconnectWallet();
  const [open, setOpen] = useState(false);
  const [alignment, setAlignment] = useState<"center" | "end">("center");

  useEffect(() => {
    const handleResize = () => {
      setAlignment(window.innerWidth >= 640 ? "end" : "center");
    };

    // Set initial alignment
    handleResize();

    // Add event listener
    window.addEventListener('resize', handleResize);

    // Cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      {
        account ? (
          <div className={`space-y-4 ${fullWidth ? 'w-full' : ''}`}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button>
                  {/* <Image src={account.icon || ppIcon} alt="PP" width={24} height={24} className='rounded-full' /> */}
                  <span >
                    {suiNSName ? `${suiNSName.split('.sui')[0]}` : `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                  </span>
                  {/* <Image src={chevronDown} alt="Chevron Down" width={16} height={16} /> */}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align={alignment} className="w-56">
                <DropdownMenuLabel className="text-sm font-medium">
                  {suiNSName ? `${suiNSName.split('.sui')[0]}` : `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => navigate('/upload')}
                >
                  <Upload className="w-4 h-4" />
                  <span>Upload video</span>
                </DropdownMenuItem>
                <DropdownMenuItem
                  className="flex items-center gap-2"
                  onClick={() => navigate('/myvideos')}
                >
                  <Video className="w-4 h-4" />
                  <span>My Videos</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => navigator.clipboard.writeText(account.address)}
                  className="flex items-center gap-2"
                >
                  <Copy className="w-4 h-4" />
                  <span>Copy Address</span>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <a href={`https://suiscan.xyz/address/${account.address}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2">
                    <ArrowUpRight className="w-4 h-4" />
                    <span>View on Explorer</span>
                  </a>
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => {
                    disconnect();
                    if (window.location.pathname === '/link') {
                      window.location.href = '/connect';
                    }
                  }}
                  className="flex items-center gap-2 text-destructive focus:text-destructive"
                >
                  <Trash className="w-4 h-4" />
                  <span>Disconnect</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        ) : (
          <ConnectModal
            trigger={
              <Button >
                Connect Wallet
              </Button>
            }
            open={open}
            onOpenChange={(isOpen) => setOpen(isOpen)}
          />
        )
      }
    </>
  )
}
