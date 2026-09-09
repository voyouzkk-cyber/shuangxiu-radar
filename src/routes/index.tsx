import { createFileRoute } from "@tanstack/react-router";
import { LookupStage } from "@/components/lookup-stage";

export const Route = createFileRoute("/")({
  component: Home,
});

function Home() {
  return <LookupStage />;
}
