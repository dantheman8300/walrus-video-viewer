import { useSuiClient } from '@mysten/dapp-kit';
import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

interface SuiObjectId {
  id: string;
}

interface SuiStorage {
  type: string;
  fields: {
    end_epoch: number;
    id: SuiObjectId;
    start_epoch: number;
    storage_size: string;
  };
}

interface SuiObjectFields {
  blob_id: string;
  certified_epoch: number;
  deletable: boolean;
  encoding_type: number;
  id: SuiObjectId;
  registered_epoch: number;
  size: string;
  storage: SuiStorage;
}

interface SuiObjectContent {
  dataType: 'moveObject';
  type: string;
  hasPublicTransfer: boolean;
  fields: SuiObjectFields;
}

interface SuiObjectResponse {
  data: {
    objectId: string;
    version: string;
    digest: string;
    content: SuiObjectContent;
  };
}

export function ViewPage() {
  const [blobId, setBlobId] = useState<string | null>(null);

  const { id } = useParams();
  const suiClient = useSuiClient();

  useEffect(() => {
    if (!id) return;
    const fetchObject = async () => {
      if (id.startsWith('0x')) {
        const object = await suiClient.getObject({
          id: id,
          options: {
            showContent: true,
          }
        }) as unknown as SuiObjectResponse;
        console.log(object);

        const blobId = blobIdToBase64(object.data.content.fields.blob_id);
        console.log(blobId);
        setBlobId(blobId);
      } else {
        setBlobId(id);
      }
    }
    fetchObject();
  }, [id])

  return (
    <div className="flex flex-col items-center justify-center min-h-svh p-4">
      {blobId && (
        <div className="w-full max-w-4xl">
          <div className="relative w-full" style={{ paddingBottom: '56.25%' }}>
            <video
              className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg border-4 border-gray-200"
              controls
              src={`https://aggregator.mainnet.walrus.mirai.cloud/v1/blobs/${blobId}`}
            >
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      )}
      <div className="mt-4 text-center">
        <p className="text-sm text-gray-500">ID: {id}</p>
      </div>
    </div>
  );
} 

function blobIdToBase64(blobId: string): string {
  // Convert the blobId string to a BigInt
  let bigInt = BigInt(blobId);

  // Initialize a Uint8Array of 32 bytes (256 bits) with zeros
  let bytes = new Uint8Array(32);

  // Convert the BigInt to bytes in little-endian order
  for (let i = 0; i < 32; i++) {
      bytes[i] = Number(bigInt & BigInt(0xFF));
      bigInt >>= BigInt(8);
  }

  // Convert the bytes to a Buffer
  const buffer = Buffer.from(bytes);

  // Encode the Buffer to Base64
  let base64 = buffer.toString('base64');

  // Convert to URL-safe Base64 (replace '+' with '-', '/' with '_') and remove padding '='
  base64 = base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');

  return base64;
}