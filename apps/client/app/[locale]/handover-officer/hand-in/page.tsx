import CourierCard from '@/components/cards/courier-card';
import { Button } from '@/components/ui/button';
import { Couriers } from '@/utils/data/dummy';
import { courierManagerIcons } from '../../courier-manager/components/icons/courier-manager-icons';
import { CourierStatisticsIcons } from '../components/icons/courier-statistics-icons';
import Link from 'next/link';

export default function HandIn({
  params: { locale },
}: {
  params: { locale: string };
}) {
  return (
    <div className="lg:p-2">
      <h1 className="font-bold text-lg text-foreground">Hand In</h1>
      <p className="text-sm font-semibold text-foreground/50">
        {
          'Please select a courier to inspect and receive reshipped & returned orders.'
        }
      </p>
      <div className="flex items-center justify-end w-full">
        <Link
          href={`hand-in/all/inspection`}
          className="flex items-center w-44 border border-accent/50 bg-transparent hover:bg-accent hover:text-accent-foreground h-8 px-4 py-2 rounded-xl text-xs font-semibold"
        >
          {courierManagerIcons['inspect']}
          <span className="ml-2">Inspection History</span>
        </Link>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5 mt-5 w-full">
        {Couriers.map((courier) => (
          <CourierCard
            key={courier._id}
            courier={courier}
            locale={locale}
            href={`hand-in/${courier._id}/inspection/current`}
            hrefOptions={{
              icon: courierManagerIcons['inspect'],
              tooltip: 'Inspect',
            }}
          >
            <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-5">
              <div className="grid grid-cols-4 h-auto px-5 py-2 rounded-xl bg-muted items-center justify-between">
                <div className="flex flex-col gap-1 items-center justify-center">
                  {CourierStatisticsIcons['outForDelivery']}
                  <p className="text-xs font-bold">46</p>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                  {CourierStatisticsIcons['delivered']}
                  <p className="text-xs font-bold">12</p>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                  {CourierStatisticsIcons['toBeReshipped']}
                  <p className="text-xs font-bold">8</p>
                </div>
                <div className="flex flex-col gap-1 items-center justify-center">
                  {CourierStatisticsIcons['collectedAmount']}
                  <p className="text-xs font-bold">
                    {(2509.5).toLocaleString('en-EG', {
                      style: 'currency',
                      currency: 'EGP',
                    })}
                  </p>
                </div>
              </div>
              {/* <Link
                href={`hand-over/${courier._id}`}
                className="h-8 w-40 bg-accent text-accent-foreground hover:bg-accent/90 px-4 py-2 rounded-xl text-xs font-semibold flex items-center justify-center"
              >
                Inspect
              </Link> */}
            </div>
          </CourierCard>
        ))}
      </div>
    </div>
  );
}
