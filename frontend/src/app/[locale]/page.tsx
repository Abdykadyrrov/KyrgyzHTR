"use client";

import { About } from "@/screens/About";
import { Upload } from "@/screens/Upload";

export default function Home() {
  return (
    <main className="flex w-svw min-h-screen flex-col items-center">
      <About />
      <Upload />
    </main>
  );
}
