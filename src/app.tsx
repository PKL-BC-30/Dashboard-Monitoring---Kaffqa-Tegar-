import type { Component } from 'solid-js';
import { Link, useRoutes } from '@solidjs/router';

import { routes } from './routes';

const App: Component = () => {
  const Route = useRoutes(routes);

  return (
    <>
      <nav class="bg-gray-200 text-gray-900 px-4">
        <ul class="flex items-center justify-between">
          <div class="flex">
            <li class="py-2 px-4">
              <Link href="/" class="no-underline hover:underline">
                Home
              </Link>
            </li>
            <li class="py-2 px-4">
              <Link href="/about" class="no-underline hover:underline">
                About
              </Link>
            </li>
            <li class="py-2 px-4">
              <Link href="/dashboard" class="no-underline hover:underline">
                Dashboard
              </Link>
            </li>
            <li class="py-2 px-4">
              <Link href="/error" class="no-underline hover:underline">
                Error
              </Link>
            </li>
          </div>
          <div class="flex">
            <li class="py-2 px-4">
              <Link href="/register" class="no-underline hover:underline">
                Register
              </Link>
            </li>
            <li class="py-2 px-4">
              <Link href="/login" class="no-underline hover:underline">
                Login
              </Link>
            </li>
          </div>
        </ul>
      </nav>

      <main>
        <Route />
      </main>
    </>
  );
};

export default App;
