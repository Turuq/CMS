import { Skeleton } from '@/components/ui/skeleton';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function TableSkeleton() {
  return (
    <div className="p-2 rounded-xl bg-light dark:bg-dark_border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>
              <Skeleton className="w-40 h-5" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-40 h-5" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-40 h-5" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-40 h-5" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-40 h-5" />
            </TableHead>
            <TableHead>
              <Skeleton className="w-40 h-5" />
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Array.from({ length: 10 }).map((_, index) => (
            <TableRow key={index}>
              <TableCell>
                <Skeleton className="w-20 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-5" />
              </TableCell>
              <TableCell>
                <Skeleton className="w-20 h-5" />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
