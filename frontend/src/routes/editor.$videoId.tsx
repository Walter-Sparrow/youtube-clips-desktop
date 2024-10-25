import { Button } from "@/components/ui/button";
import { TimePicker } from "@/components/ui/datetime-picker";
import { DualRangeSlider } from "@/components/ui/range-slider";
import { Separator } from "@/components/ui/separator";
import { getSeconds } from "@/lib/utils";
import { createFileRoute, useRouter } from "@tanstack/react-router";
import {
  add,
  differenceInSeconds,
  format,
  isAfter,
  isBefore,
  startOfDay,
} from "date-fns";
import { ArrowLeft, Clock, Loader2 } from "lucide-react";
import { useCallback, useEffect, useRef, useState } from "react";
import { toast } from "sonner";
import { CreateClip } from "../../wailsjs/go/main/App";
import YouTubePlayer from "youtube-player";
import { Skeleton } from "@/components/ui/skeleton";

type Player = ReturnType<typeof YouTubePlayer>;

const zeroDate = startOfDay(new Date());

export const Route = createFileRoute("/editor/$videoId")({
  component: Editor,
});

function Editor() {
  const { videoId } = Route.useParams();
  const { history } = useRouter();
  const playerRef = useRef<Player | null>(null);
  const [duration, setDuration] = useState<number>(0);
  const [videoTitle, setVideoTitle] = useState<string>("");
  const [clipRange, setClipRange] = useState<[Date, Date]>([
    zeroDate,
    zeroDate,
  ]);
  const [isApplying, setIsApplying] = useState(false);

  const playerRefSetter = useCallback(
    (divRef: HTMLDivElement) => {
      if (divRef) {
        playerRef.current = YouTubePlayer(divRef, {
          host: "https://www.youtube.com",
          height: undefined,
          playerVars: {
            autoplay: 0,
          },
        });
      }
    },
    [videoId]
  );

  useEffect(() => {
    if (!videoId || !playerRef.current) return;
    const ref = playerRef.current;

    ref.cueVideoById(videoId);
    ref.on("stateChange", (event) => {
      const playerData = event.target as any;
      if (event.data === -1 && playerData) {
        setVideoTitle(playerData.videoTitle);
        const duration = playerData.getDuration();
        setDuration(duration);
        setClipRange([zeroDate, add(zeroDate, { seconds: duration })]);
      }
    });
  }, [videoId]);

  const handleStartChange = (date: Date | undefined) => {
    const maxEnd = add(zeroDate, { seconds: duration });
    if (date && isAfter(date, zeroDate) && isBefore(date, maxEnd)) {
      setClipRange([date, clipRange[1]]);
    }
  };

  const handleEndChange = (date: Date | undefined) => {
    const maxEnd = add(zeroDate, { seconds: duration });
    if (date && isAfter(date, zeroDate) && isBefore(date, maxEnd)) {
      setClipRange([clipRange[0], date]);
    }
  };

  const handleRangeChange = (value: [number, number]) => {
    setClipRange([
      add(zeroDate, { seconds: value[0] }),
      add(zeroDate, { seconds: value[1] }),
    ]);
  };

  const handleApply = () => {
    const [start, end] = clipRange;
    if (isAfter(start, end)) {
      toast.error("Start time must be before end time");
      return;
    }

    setIsApplying(true);
    CreateClip({
      videoId,
      start: format(start, "HH:mm:ss"),
      end: format(end, "HH:mm:ss"),
    })
      .then((res) => {
        toast.success(`Success in ${res}`);
        setIsApplying(false);
      })
      .catch((err) => {
        toast.error(err);
        setIsApplying(false);
      });
  };

  if (!videoId) {
    return <div>No video ID found</div>;
  }

  return (
    <div className="min-h-screen flex gap-10 p-10">
      <div className="flex items-start justify-center gap-10 w-full">
        <Button onClick={() => history.back()}>
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>
        <div className="flex flex-col gap-5 w-full overflow-hidden">
          <div
            ref={playerRefSetter}
            id="video-container"
            className="aspect-video w-full rounded-md"
          />
          {!videoTitle ? (
            <Skeleton className="w-full h-10" />
          ) : (
            <div className="text-2xl font-bold text-ellipsis text-nowrap max-w-[80%] overflow-hidden">
              {videoTitle}
            </div>
          )}
          <Separator />
          {!duration ? (
            <Skeleton className="w-full h-10" />
          ) : (
            <div className="flex flex-col gap-2">
              <span className="text-md text-white">Duration:</span>
              <div className="flex gap-2">
                <div className="flex w-full items-center px-4 py-2 rounded-md border border-input gap-5">
                  <Clock className="h-4 w-4 shrink-0" />
                  <TimePicker
                    className="w-full"
                    inputClassName="border-transparent"
                    date={clipRange[0]}
                    onChange={handleStartChange}
                  />
                  <Separator orientation="vertical" />
                  <TimePicker
                    className="w-full"
                    inputClassName="border-transparent"
                    date={clipRange[1]}
                    onChange={handleEndChange}
                  />
                </div>
              </div>
            </div>
          )}
          <DualRangeSlider
            min={0}
            max={duration}
            className="py-4"
            value={[getSeconds(clipRange[0]), getSeconds(clipRange[1])]}
            onValueChange={handleRangeChange}
          />
          {!duration ? (
            <Skeleton className="w-full h-10" />
          ) : (
            <Button size="lg" onClick={handleApply} disabled={isApplying}>
              {isApplying && <Loader2 className="h-4 w-4 animate-spin" />}
              {isApplying ? "Applying..." : "Apply"}
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
