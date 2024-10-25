import { createLazyFileRoute, useNavigate } from "@tanstack/react-router";
import arrow from "../assets/arrow.avif";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import { toast } from "sonner";

export const Route = createLazyFileRoute("/")({
  component: Index,
});

function Index() {
  const [url, setUrl] = useState("");
  const navigate = useNavigate();

  const handleLoadVideo = () => {
    if (!url || !URL.canParse(url)) {
      toast.error("Invalid URL");
      return;
    }

    const urlObj = new URL(url);
    const videoId = urlObj.searchParams.get("v");
    if (!videoId) {
      toast.error("No video ID found");
      return;
    }

    navigate({
      to: "/editor/$videoId",
      params: {
        videoId,
      },
    });
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-10">
      <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-500">
        YouTube Clips
      </h1>
      <div className="flex items-center justify-center gap-2">
        <div className="relative">
          <img
            src={arrow}
            className="hidden md:block absolute w-[200px] -left-[160px] -top-[130px] scale-[-1]"
            alt="arrow"
          />
          <div className="hidden md:flex absolute -left-[170px] -top-[80px] gap-2 rotate-[-20deg]">
            <Button
              className="text-xl rotate-[-10deg] -translate-y-5"
              size="icon"
              variant="outline"
            >
              ⌘
            </Button>
            <Button
              className="text-xl rotate-[10deg] -translate-x-4"
              size="icon"
              variant="outline"
            >
              V
            </Button>
          </div>
          <Input
            className="min-w-[400px]"
            placeholder="https://www.youtube.com/watch?v=dQw4w9WgXcQ"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
          />
        </div>
        <Button onClick={handleLoadVideo}>Load video</Button>
      </div>
    </div>
  );
}
