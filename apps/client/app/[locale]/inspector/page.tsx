import { icons } from '@/components/icons/icons';
import BatchCard from '@/components/inspector/batch-card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const batches = [
  {
    title: 'Batch 1',
    progress: 20,
    startDate: '2023-01-01',
    delivered: 50,
    toBeReshipped: 5,
    collected: 1000,
    finished: false,
    courier: 'John Doe',
  },
  {
    title: 'Batch 2',
    progress: 40,
    startDate: '2023-02-01',
    delivered: 60,
    toBeReshipped: 10,
    collected: 2000,
    finished: false,
    courier: 'Jane Smith',
  },
  {
    title: 'Batch 3',
    progress: 60,
    startDate: '2023-03-01',
    delivered: 70,
    toBeReshipped: 15,
    collected: 3000,
    finished: false,
    courier: 'Alice Johnson',
  },
  {
    title: 'Batch 4',
    progress: 80,
    startDate: '2023-04-01',
    endDate: '2023-04-10',
    delivered: 80,
    toBeReshipped: 20,
    collected: 4000,
    finished: false,
    courier: 'Bob Brown',
  },
  {
    title: 'Batch 5',
    progress: 100,
    startDate: '2023-05-01',
    endDate: '2023-05-10',
    delivered: 90,
    toBeReshipped: 25,
    collected: 5000,
    finished: true,
    courier: 'Charlie Davis',
  },
  {
    title: 'Batch 6',
    progress: 30,
    startDate: '2023-06-01',
    delivered: 55,
    toBeReshipped: 8,
    collected: 1500,
    finished: false,
    courier: 'Diana Evans',
  },
  {
    title: 'Batch 7',
    progress: 50,
    startDate: '2023-07-01',
    endDate: '2023-07-3',
    delivered: 65,
    toBeReshipped: 12,
    collected: 2500,
    finished: true,
    courier: 'Frank Green',
  },
  {
    title: 'Batch 8',
    progress: 70,
    startDate: '2023-08-01',
    delivered: 75,
    toBeReshipped: 18,
    collected: 3500,
    finished: false,
    courier: 'Grace Harris',
  },
  {
    title: 'Batch 9',
    progress: 90,
    startDate: '2023-09-01',
    endDate: '2023-09-10',
    delivered: 85,
    toBeReshipped: 22,
    collected: 4500,
    finished: false,
    courier: 'Henry Lee',
  },
  {
    title: 'Batch 10',
    progress: 25,
    startDate: '2023-10-01',
    delivered: 52,
    toBeReshipped: 6,
    collected: 1200,
    finished: false,
    courier: 'Ivy Martinez',
  },
];

export default function Page() {
  return (
    <div className="w-full flex flex-col gap-10">
      <div className="flex items-center justify-between">
        <Select>
          <SelectTrigger className="w-40">
            <SelectValue placeholder="Select Courier" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: 10 }).map((_, index) => (
              <SelectItem
                key={index}
                value={`Courier ${index + 1}`}
              >{`Courier ${index + 1}`}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <div className="flex items-center justify-between bg-light dark:bg-dark_border rounded-xl w-80 py-1 px-2 h-10">
          <input
            placeholder="Search by OID"
            className="bg-transparent text-xs w-full ring-0 focus:ring-0 outline-none border-0"
            value={''}
            // onChange={(e) => setOID(e.target.value)}
          />
          <button
            className="hover:text-accent"
            // onClick={() =>
            //   router.push(`/admin/courier/${id}/inspection/current/${OID}`)
            // }
          >
            {icons.search}
          </button>
        </div>
      </div>
      {/* Batch Card */}
      <div className="grid grid-cols-3 gap-5">
        <div className="flex flex-col gap-5">
          <h3 className="font-bold text-emerald-500">Finished</h3>
          {batches
            .filter((b) => b.progress === 100 || b.finished)
            .map((batch, index) => (
              <BatchCard key={index} information={batch} />
            ))}
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="font-bold text-amber-500">Almost Done</h3>
          {batches
            .filter((b) => b.progress > 25 && !b.finished && b.progress < 100)
            .map((batch, index) => (
              <BatchCard key={index} information={batch} />
            ))}
        </div>
        <div className="flex flex-col gap-5">
          <h3 className="font-bold text-red-500">Recently Started</h3>
          {batches
            .filter((b) => b.progress <= 25 && !b.finished)
            .map((batch, index) => (
              <BatchCard key={index} information={batch} />
            ))}
        </div>
      </div>
    </div>
  );
}
