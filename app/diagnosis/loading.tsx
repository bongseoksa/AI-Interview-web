import { Card, CardContent, CardHeader } from "@/components/ui/card";

export default function DiagnosisLoading() {
  return (
    <main className="mx-auto max-w-2xl px-4 py-10">
      <div className="mb-8 space-y-2">
        <div className="h-4 w-20 animate-pulse rounded bg-muted" />
        <div className="h-8 w-48 animate-pulse rounded bg-muted" />
        <div className="h-4 w-72 animate-pulse rounded bg-muted" />
      </div>

      <Card>
        <CardHeader>
          <div className="h-6 w-32 animate-pulse rounded bg-muted" />
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="h-4 w-full animate-pulse rounded bg-muted" />
          <div className="h-4 w-5/6 animate-pulse rounded bg-muted" />
          <div className="h-4 w-4/6 animate-pulse rounded bg-muted" />
        </CardContent>
      </Card>

      <div className="mt-6 h-12 w-full animate-pulse rounded bg-muted" />
    </main>
  );
}
