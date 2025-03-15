'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function Home() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && user) {
      router.push('/climbs');
    }
  }, [user, loading, router]);

  return (
    <main className="min-h-screen">
      <div className="container mx-auto px-4 py-16">
        <div className="flex flex-col items-center text-center">
          <h1 className="text-5xl font-bold mb-6">
            Track Your Climbing Journey
          </h1>
          <p className="text-xl text-muted-foreground mb-12 max-w-2xl">
            SendIt helps you track your climbing progress, log your attempts, and celebrate your achievements. 
            Whether you're bouldering, sport climbing, or trad climbing, SendIt is your digital climbing companion.
          </p>
          <div className="flex gap-4">
            <Link href="/register">
              <Button size="lg">Start Sending Today</Button>
            </Link>
            <Link href="/login">
              <Button variant="outline" size="lg">Already a Sender?</Button>
            </Link>
          </div>

          <div className="grid sm:grid-cols-3 gap-8 mt-20 w-full">
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Track Progress</h2>
              <p className="text-muted-foreground">
                Log your climbs and attempts to see your progression over time.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Stay Motivated</h2>
              <p className="text-muted-foreground">
                Set goals and track your achievements to stay motivated.
              </p>
            </div>
            <div className="flex flex-col items-center p-6 border rounded-lg">
              <h2 className="text-xl font-semibold mb-4">Learn & Improve</h2>
              <p className="text-muted-foreground">
                Review your attempts and notes to understand what works and what doesn't.
              </p>
            </div>
          </div>

          <div className="mt-24 w-full">
            <h2 className="text-3xl font-bold mb-8 text-center">Coming Soon</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Training Analytics</h3>
                <p className="text-muted-foreground">Track and analyze your training progress with detailed metrics and progress tracking.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Indoor Session Analysis</h3>
                <p className="text-muted-foreground">Upload and analyze your indoor climbing sessions with detailed statistics and insights.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">AI Performance Insights</h3>
                <p className="text-muted-foreground">Get AI-powered analysis of your training and climbing patterns to optimize your progression.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Social Climbing</h3>
                <p className="text-muted-foreground">Connect with friends, share your sends, and celebrate each other's achievements.</p>
              </div>
              <div className="p-6 border rounded-lg">
                <h3 className="text-lg font-semibold mb-3">Trip Planning</h3>
                <p className="text-muted-foreground">Plan climbing trips with friends and discover shared projects in climbing areas.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
