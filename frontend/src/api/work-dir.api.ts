import { useQuery } from "@tanstack/react-query";
import { GetClipsDir } from "../../wailsjs/go/main/App";

export const useWorkDir = () => useQuery({
  queryKey: ["work-dir"],
  queryFn: GetClipsDir,
});
