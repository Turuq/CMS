import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Skeleton } from "../ui/skeleton";
import { icons } from "../icons/icons";

export default function CourierCardSkeleton() {
  return (
    <Card className="w-full rounded-xl h-40 flex flex-col gap-5">
      <CardHeader>
        <CardTitle className="flex items-center justify-between gap-5">
          <div className="flex flex-col gap-1">
            <Skeleton className="w-40 h-6" />
            <Skeleton className="w-32 h-6" />
          </div>
          <Link
            href={""}
            className="text-sm bg-muted cursor-pointer text-dark dark:text-light hover:text-accent rounded-xl size-10 flex items-center justify-center"
          >
            {icons.externalLink}
          </Link>
        </CardTitle>
      </CardHeader>
      <CardContent className="flex items-center gap-10">
        <div className="flex items-center gap-2 group">
          <div className="group-hover:text-accent flex items-center justify-center">
            <div className="group-hover:hidden flex">{icons.phone}</div>
            <div className="hidden group-hover:flex">{icons.forwardCall}</div>
          </div>
          <Skeleton className="w-20 h-6" />
        </div>
        <div className="flex items-center gap-2 group">
          <div className="group-hover:text-accent flex items-center justify-center">
            <div className="group-hover:hidden flex">{icons.emptyLocation}</div>
            <div className="hidden group-hover:flex">{icons.location}</div>
          </div>
          <Skeleton className="w-20 h-6" />
        </div>
      </CardContent>
    </Card>
  );
}
