export function blobIdToBase64(blobId: string): string {
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