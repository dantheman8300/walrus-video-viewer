import { getAggregatorUrl } from '@/helpers/aggregators';
import { blobIdToBase64 } from '@/helpers/encode';
import { useSuiClient, useCurrentAccount } from '@mysten/dapp-kit';
import { useEffect, useState, useRef, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';

interface VideoObject {
  id: string;
  blobId: string;
}

interface PaginatedResponse {
  data: {
    data: {
      objectId: string;
      content: {
        fields: {
          blob_id: string;
        };
      };
    };
  }[];
  nextCursor: string | null;
  hasNextPage: boolean;
}

export function MyVideosPage() {
  const [videos, setVideos] = useState<VideoObject[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [cursor, setCursor] = useState<string | null>(null);
  const observer = useRef<IntersectionObserver | null>(null);
  const lastVideoElementRef = useRef<HTMLDivElement>(null);
  const account = useCurrentAccount();
  const suiClient = useSuiClient();
  const navigate = useNavigate();

  const fetchVideos = useCallback(async (cursor: string | null = null) => {
    if (!account) return;

    try {
      const response = await suiClient.getOwnedObjects({
        owner: account.address,
        options: {
          showContent: true,
        },
        filter: {
          StructType: '0xfdc88f7d7cf30afab2f82e8380d11ee8f70efb90e863d1de8616fae1bb09ea77::blob::Blob'
        },
        cursor,
      }) as unknown as PaginatedResponse;

      const newVideos = response.data.map(obj => ({
        id: obj.data.objectId,
        blobId: blobIdToBase64(obj.data.content.fields.blob_id),
      }));

      setVideos(prev => cursor ? [...prev, ...newVideos] : newVideos);
      setCursor(response.nextCursor);
      setHasMore(response.hasNextPage);
    } catch (error) {
      console.error('Error fetching videos:', error);
    } finally {
      setLoading(false);
      setLoadingMore(false);
    }
  }, [account, suiClient]);

  useEffect(() => {
    setLoading(true);
    fetchVideos();
  }, [fetchVideos]);

  useEffect(() => {
    if (loadingMore || !hasMore) return;

    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting) {
        setLoadingMore(true);
        fetchVideos(cursor);
      }
    });

    if (lastVideoElementRef.current) {
      observer.current.observe(lastVideoElementRef.current);
    }

    return () => {
      if (observer.current) {
        observer.current.disconnect();
      }
    };
  }, [cursor, fetchVideos, hasMore, loadingMore]);

  if (loading && videos.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-svh">
        <div className="text-lg">Loading your videos...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 mt-16">
      <h1 className="text-3xl font-bold mb-8">My Videos</h1>
      {videos.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-gray-600">You haven't uploaded any videos yet.</p>
          <button
            onClick={() => navigate('/upload')}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Upload a Video
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={video.id}
              ref={index === videos.length - 1 ? lastVideoElementRef : null}
              className="border rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow cursor-pointer"
              onClick={() => navigate(`/view/${video.id}`)}
            >
              <div className="relative" style={{ paddingBottom: '56.25%' }}>
                <video
                  className="absolute top-0 left-0 w-full h-full object-cover"
                  src={`${getAggregatorUrl()}/v1/blobs/${video.blobId}`}
                />
              </div>
              <div className="p-4">
                <p className="text-sm text-gray-500 truncate">ID: {video.id}</p>
              </div>
            </div>
          ))}
        </div>
      )}
      {loadingMore && (
        <div className="flex justify-center mt-8">
          <div className="text-lg">Loading more videos...</div>
        </div>
      )}
    </div>
  );
} 