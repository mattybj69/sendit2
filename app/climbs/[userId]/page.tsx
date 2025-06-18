import { Suspense } from 'react';
import { Spinner } from '../../components/ui/spinner';
import { FriendClimbsContent } from './FriendClimbsContent';

interface PageProps {
  params: Promise<{ userId: string }>;
}

export default async function FriendClimbsPage({ params }: PageProps) {
  const resolvedParams = await params;
  return (
    <Suspense fallback={
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto py-6">
          <Spinner />
        </div>
      </div>
    }>
      <FriendClimbsContent userId={resolvedParams.userId} />
    </Suspense>
  );
} 