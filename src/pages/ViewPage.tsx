import { useEffect } from 'react';
import { useParams } from 'react-router-dom';

export function ViewPage() {
  const { id } = useParams();

  useEffect(() => {
    if (!id) {
      return;
    } else if (id.startsWith('0x')) {
      console.log('id is a objectId');
    } else {
      console.log('id is a blobId');
    }
  }, [id])

  return (
    <div className="flex flex-col items-center justify-center min-h-svh">
      <h1 className="text-2xl font-bold mb-4">Viewing ID: {id}</h1>
      <p className="text-gray-600">This is a dynamic route page</p>
    </div>
  );
} 