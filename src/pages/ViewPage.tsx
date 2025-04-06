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
      }
    }
    fetchObject();
  }, [id])

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="text-2xl font-bold mb-4">Viewing ID: {id}</h1>
      <p className="text-gray-600">This is a dynamic route page</p>
      <p className="text-gray-600">Blob ID: {blobId}</p>
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