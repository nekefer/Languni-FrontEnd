import { createFileRoute } from "@tanstack/react-router";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { RequireOnboarding } from "../../components/RequireOnboarding";
import { WordDetail } from "../../components/WordDetail";

export const Route = createFileRoute("/word/$wordId")({
  component: WordDetailRoute,
});

function WordDetailRoute() {
  const { wordId } = Route.useParams();

  return (
    <ProtectedRoute>
      <RequireOnboarding>
        <WordDetail word={decodeURIComponent(wordId)} />
      </RequireOnboarding>
    </ProtectedRoute>
  );
}
