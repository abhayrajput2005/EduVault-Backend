import { Button } from "@/components/ui/button";

export function SocialButtons() {
  return (
    <div className="grid grid-cols-2 gap-3">
      <Button type="button" variant="outline" className="glass border-0">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M21.35 11.1H12v2.96h5.36c-.23 1.5-1.7 4.4-5.36 4.4-3.22 0-5.85-2.66-5.85-5.96S8.78 6.55 12 6.55c1.83 0 3.06.78 3.77 1.45l2.57-2.48C16.7 3.97 14.55 3 12 3 6.98 3 2.92 7.04 2.92 12s4.06 9 9.08 9c5.24 0 8.7-3.68 8.7-8.86 0-.6-.06-1.04-.15-1.04z"
          />
        </svg>
        Google
      </Button>
      <Button type="button" variant="outline" className="glass border-0">
        <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden>
          <path
            fill="currentColor"
            d="M16.36 1.43c0 1.14-.42 2.21-1.12 3-.78.9-2.07 1.62-3.13 1.54-.14-1.11.42-2.27 1.08-3.01.74-.84 2.01-1.46 3.17-1.53zM20.5 17.3c-.56 1.27-.83 1.84-1.55 2.97-1 1.58-2.42 3.55-4.18 3.57-1.56.02-1.96-1.02-4.07-1-2.11.01-2.55 1.02-4.11 1-1.76-.02-3.1-1.8-4.1-3.38C-.4 16.66-.7 11.6 1.45 8.88c1.5-1.94 3.87-3.07 6.09-3.07 2.27 0 3.7 1.24 5.57 1.24 1.81 0 2.92-1.24 5.54-1.24 1.99 0 4.1 1.09 5.61 2.96-4.93 2.7-4.13 9.74.24 8.53z"
          />
        </svg>
        Apple
      </Button>
    </div>
  );
}
