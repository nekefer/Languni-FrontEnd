import { createFileRoute } from "@tanstack/react-router";
import { lazy, Suspense } from "react";
import PageLoader from "../../components/PageLoader";

const VideoPlayer = lazy(() => import("../../components/VideoPlayer"));

export const Route = createFileRoute("/player/$videoId")({
  component: VideoPlayerPage,
});

function VideoPlayerPage() {
  const { videoId } = Route.useParams();

  return (
    <Suspense fallback={<PageLoader />}>
      <VideoPlayer videoId={videoId} />
    </Suspense>
  );
}
