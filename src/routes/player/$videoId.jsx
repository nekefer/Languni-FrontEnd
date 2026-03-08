import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { RequireOnboarding } from "../../components/RequireOnboarding";
import PageLoader from "../../components/PageLoader";

const VideoPlayer = lazy(() => import("../../components/VideoPlayer"));

export const Route = createFileRoute("/player/$videoId")({
  component: VideoPlayerPage,
});

function VideoPlayerPage() {
  const { videoId } = Route.useParams();

  return (
    <ProtectedRoute noLayout>
      <RequireOnboarding>
        <Suspense fallback={<PageLoader />}>
          <VideoPlayer videoId={videoId} />
        </Suspense>
      </RequireOnboarding>
    </ProtectedRoute>
  );
}
