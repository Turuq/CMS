import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Skeleton } from "../ui/skeleton";

export default function KpiCardSkeleton() {
  return (
    <Card
      className={`rounded-xl drop-shadow-sm relative shadow-accent/10 min-h-20`}
    >
      <CardHeader
        className={`px-6 pt-3 pb-1 flex flex-row items-center justify-between gap-2`}
      >
        <CardTitle className={'flex items-center gap-5'}>
          <Skeleton className="w-48 h-10" />
        </CardTitle>
      </CardHeader>
      <CardContent className={`px-6 pt-0 pb-1`}>
        <Skeleton className="w-36 h-6" />
      </CardContent>
    </Card>
  );
}
