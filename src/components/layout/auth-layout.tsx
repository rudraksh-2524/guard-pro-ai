import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/brand/logo";

export function AuthLayout({
  title,
  description,
  children,
}: {
  title: string;
  description: string;
  children: ReactNode;
}) {
  return (
    <div className="grid-lines flex min-h-screen flex-col bg-background">
      <header className="border-b border-border">
        <div className="mx-auto flex h-14 w-full max-w-6xl items-center px-4 sm:px-6">
          <Link to="/" aria-label="Proctor Guard AI home">
            <Logo showTagline />
          </Link>
        </div>
      </header>
      <main className="flex flex-1 items-start justify-center px-4 py-10 sm:items-center sm:py-14">
        <div className="w-full max-w-md">
          <div className="panel p-5 sm:p-6">
            <h1 className="text-lg font-semibold text-foreground">{title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
            <div className="mt-5">{children}</div>
          </div>
          <p className="mt-4 text-center text-xs text-muted-foreground">
            Demonstration deployment · sample data only
          </p>
        </div>
      </main>
    </div>
  );
}