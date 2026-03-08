import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { RequireOnboarding } from "../../components/RequireOnboarding";
import PageLoader from "../../components/PageLoader";

const WordDetail = lazy(() =>
  import("../../components/WordDetail").then((m) => ({ default: m.WordDetail }))
);

export const Route = createFileRoute("/word/$wordId")({
  component: WordDetailRoute,
});

function WordDetailRoute() {
  const { wordId } = Route.useParams();

  return (
    <ProtectedRoute>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <WordDetail word={decodeURIComponent(wordId)} />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  );
}
