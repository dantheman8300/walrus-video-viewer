import { ConnectModal, useCurrentAccount, useDisconnectWallet, useResolveSuiNSName } from "@mysten/dapp-kit"
import { useEffect, useState } from "react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Trash, ArrowUpRight, Copy } from "lucide-react";


export function ConnectWalletButton({ fullWidth = false }: { fullWidth?: boolean }) {

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
              <DropdownMenuContent align={alignment} className="flex flex-col gap-2">
                <div className="w-full flex flex-row justify-start gap-2">
                  {/* <Image src={ppIcon} alt="PP" className="rounded-full w-[40px] h-[40px]" /> */}
                  <div className="flex flex-col items-start justify-start">
                    <span>
                      {suiNSName ? `${suiNSName.split('.sui')[0]}` : `${account.address.slice(0, 6)}...${account.address.slice(-4)}`}
                    </span>
                    {suiNSName && (
                      <span className={`text-[#FFF] opacity-70 text-sm`}>
                        {account.address.slice(0, 6)}...{account.address.slice(-4)}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex flex-row justify-between gap-1">
                  <Button
                    variant="secondary"
                    className="h-fit w-[92px] py-2 rounded-md flex flex-col items-center justify-center gap-1"
                    onClick={() => navigator.clipboard.writeText(account.address)}
                  >
                    <Copy className="w-4 h-4" />
                    <span>Copy</span>
                  </Button>
                  <a href={`https://suiscan.xyz/address/${account.address}`} target="_blank" rel="noopener noreferrer">
                    <Button 
                      variant="secondary"
                      className="h-fit w-[92px] py-2 rounded-md flex flex-col items-center justify-center gap-1"
                    >
                      <ArrowUpRight className="w-4 h-4" />
                      <span>Explorer</span>
                    </Button>
                  </a>
                  <Button
                    variant="destructive"                  
                    className="h-fit w-[92px] py-2  text-[#FFF] rounded-md flex flex-col items-center justify-center gap-1"
                    onClick={() => {
                      disconnect();
                      if (window.location.pathname === '/link') {
                        window.location.href = '/connect';
                      }
                    }}
                  >
                    <Trash className="w-4 h-4" />
                    <span>Disconnect</span>
                  </Button>
                </div>
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
