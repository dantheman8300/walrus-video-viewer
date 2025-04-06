import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useCurrentAccount } from '@mysten/dapp-kit';
import { Upload } from 'lucide-react';

export function UploadPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const account = useCurrentAccount();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = () => {
    if (!selectedFile) return;
    // TODO: Implement upload logic here
    console.log('Uploading file:', selectedFile);
  };

  if (!account) {
    return (
      <div className="flex flex-col items-center justify-center min-h-svh p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
            <CardDescription>Please connect your wallet to upload videos.</CardDescription>
          </CardHeader>
        </Card>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Upload Video</CardTitle>
          <CardDescription>Choose a video file to upload to Walrus.</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid w-full items-center gap-4">
            <div className="grid w-full max-w-sm items-center gap-1.5">
              <Label htmlFor="video">Video File</Label>
              <Input
                id="video"
                type="file"
                accept="video/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
            </div>
            {selectedFile && (
              <div className="text-sm text-muted-foreground">
                Selected: {selectedFile.name} ({(selectedFile.size / (1024 * 1024)).toFixed(2)} MB)
              </div>
            )}
            <Button
              onClick={handleUpload}
              disabled={!selectedFile}
              className="w-full"
            >
              <Upload className="mr-2 h-4 w-4" />
              Upload Video
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
} 