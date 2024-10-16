import { ProgressBar } from '@tremor/react';
import {
  Card,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '../ui/card';
import { Skeleton } from '../ui/skeleton';

export default function BatchCardSkeleton() {
  return (
    <Card className="rounded-xl border-muted w-full">
      <CardHeader className="space-y-0.5 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex flex-col space-y-0.5">
            <ProgressBar
              value={0}
              color="stone"
              showAnimation
              className="w-20"
            />
            <CardTitle>
              <Skeleton className="h-10 w-40 my-2" />
            </CardTitle>
            <CardDescription className="text-xs font-semibold">
              <Skeleton className="h-5 w-40" />
            </CardDescription>
          </div>
          <Skeleton className="h-8 w-40 rounded-xl" />
        </div>
      </CardHeader>
      <CardFooter className="w-full">
        <div className="flex items-center justify-between w-full">
          <Skeleton className="w-60 h-5" />
          <Skeleton className="size-7 rounded-full" />
        </div>
      </CardFooter>
    </Card>
  );
}
