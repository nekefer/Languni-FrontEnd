import { createFileRoute } from "@tanstack/react-router";
import VideoPlayer from "../../components/VideoPlayer";
import { ProtectedRoute } from "../../components/ProtectedRoute";
import { RequireOnboarding } from "../../components/RequireOnboarding";

export const Route = createFileRoute("/player/$videoId")({
  component: VideoPlayerPage,
});

function VideoPlayerPage() {
  const { videoId } = Route.useParams();

  return (
    <ProtectedRoute noLayout>
      <RequireOnboarding>
        <VideoPlayer videoId={videoId} />
      </RequireOnboarding>
    </ProtectedRoute>
  );
}
