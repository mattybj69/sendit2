'use client';

import Link from 'next/link';
import { useAuth } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Spinner } from '@/components/ui/spinner';

export function Header() {
  const { user, loading, signOut } = useAuth();

  return (
    <header className="border-b">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto h-16 flex items-center justify-between">
          <Link href="/" className="text-2xl font-bold">
            SendIt
          </Link>

          <nav className="flex items-center">
            {loading ? (
              <Spinner className="h-5 w-5" />
            ) : user ? (
              <Button variant="outline" onClick={() => signOut()}>
                Sign Out
              </Button>
            ) : (
              <div className="flex items-center gap-4">
                <Link href="/login">
                  <Button variant="ghost">Login</Button>
                </Link>
                <Link href="/register">
                  <Button>Register</Button>
                </Link>
              </div>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
} 