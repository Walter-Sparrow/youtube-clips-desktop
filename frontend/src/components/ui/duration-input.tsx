import { maskitoTimeOptionsGenerator } from "@maskito/kit";
import { Input, InputProps } from "./input";
import { useMaskito } from "@maskito/react";

const timeOptions = maskitoTimeOptionsGenerator({
  mode: "HH:MM:SS",
});

export function DurationInput(props: InputProps) {
  const maskedInputRef = useMaskito({ options: timeOptions });
  return <Input {...props} ref={maskedInputRef} />;
}
