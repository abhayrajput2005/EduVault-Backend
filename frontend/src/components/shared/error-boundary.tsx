import { Component, type ErrorInfo, type ReactNode } from "react";
import { AlertTriangle } from "lucide-react";
import { Button } from "@/components/ui/button";

type Props = { children: ReactNode; fallback?: ReactNode };
type State = { error: Error | null };

export class ErrorBoundary extends Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error) {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error("ErrorBoundary caught:", error, info);
  }

  render() {
    if (this.state.error) {
      if (this.props.fallback) return this.props.fallback;
      return (
        <div className="glass-strong mx-auto max-w-lg rounded-2xl p-8 text-center">
          <AlertTriangle className="mx-auto h-10 w-10 text-destructive" />
          <h2 className="mt-4 text-lg font-semibold">Something went wrong</h2>
          <p className="mt-2 text-sm text-muted-foreground">{this.state.error.message}</p>
          <Button className="mt-6" onClick={() => this.setState({ error: null })}>
            Try again
          </Button>
        </div>
      );
    }
    return this.props.children;
  }
}
