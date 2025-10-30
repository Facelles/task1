'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/auth/login'); // клієнтський редирект
  }, [router]);

  return <p>Redirecting...</p>;
}
