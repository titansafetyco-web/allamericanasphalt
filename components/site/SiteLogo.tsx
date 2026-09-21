import Image from "next/image";
import { cn } from "@/lib/utils";

export function SiteLogo({
  className,
  imageClassName,
  priority,
}: {
  className?: string;
  imageClassName?: string;
  priority?: boolean;
}) {
  return (
    <a href="/" className={cn("inline-block w-fit shrink-0", className)}>
      <Image
        src="/logo.png"
        alt="All American Asphalt, LLC — From Start to Finish"
        width={2000}
        height={760}
        className={cn("h-32 w-auto", imageClassName)}
        quality={100}
        unoptimized
        priority={priority}
      />
    </a>
  );
}
