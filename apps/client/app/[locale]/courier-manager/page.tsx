'use client';
import KpiCard from '@/components/cards/kpi-card';
// import { icons } from '@/components/icons/icons';
import { ordersStatistics } from '@/utils/data/dummy';
import moment from 'moment';
import { useTranslations } from 'next-intl';

export default function CourierManagerHome({
  params: { locale },
}: {
  params: { locale: string };
}) {
  const t = useTranslations('dashboard.statistics');
  return (
    <main className="flex min-h-screen flex-col gap-5">
      <h1 className="text-3xl font-bold opacity-80">{t('title')}</h1>
      <div className="grid grid-cols-3 items-center gap-5">
        <div className="col-span-3 lg:col-span-1">
          <KpiCard
            locale={locale}
            title={t('cards.totalOrders')}
            statistic={ordersStatistics.totalOrders}
            dotted
            animated
            link="courier-manager/orders"
          />
        </div>
        <div className="col-span-3 lg:col-span-2 grid grid-cols-3 gap-5">
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={t('cards.outForDelivery')}
              statistic={ordersStatistics.outForDelivery}
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={t('cards.toBeReshipped')}
              statistic={ordersStatistics.toBeReshipped}
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={t('cards.delivered')}
              statistic={ordersStatistics.delivered}
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={t('cards.totalShippingFees')}
              statistic={ordersStatistics.totalShippingFees}
              financial
              animated
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={t('cards.totalToBeReceived')}
              statistic={ordersStatistics.totalToBeReceived}
              financial
              animated
            />
          </div>
          <div className="col-span-3 lg:col-span-1">
            <KpiCard
              locale={locale}
              title={t('cards.numberOfCouriers')}
              statistic={ordersStatistics.numberOfCouriers}
              date={moment()}
            />
          </div>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-5">
        <div className="col-span-2 lg:col-span-1">
          <KpiCard
            locale={locale}
            title={t('cards.processingAssigned')}
            statistic={ordersStatistics.processingAssigned}
            link="courier-manager/inspection"
          />
        </div>
        <div className="col-span-2 lg:col-span-1">
          <KpiCard
            locale={locale}
            title={t('cards.processingUnassigned')}
            statistic={ordersStatistics.processingUnassigned}
            link="courier-manager/assign"
          />
        </div>
      </div>
      {/* <h1 className="text-3xl font-bold opacity-80">{`Top 5 Courier By Deliveries`}</h1> */}
      {/* <div className="grid grid-cols-5 gap-5">
        {Couriers.map((courier, index) => (
          <div key={index} className="flex items-center justify-center gap-2">
            <h1 className="text-6xl font-black opacity-50">
              {(index + 1).toLocaleString(`${locale}-EG`)}
            </h1>
            <div className="rounded-xl w-52 h-60 bg-muted p-2 flex flex-col items-center justify-center gap-5">
              <h1 className="font-bold text-base text-center capitalize">
                {courier.name}
              </h1>
              <h1 className="flex items-center space-x-1">
                {icons.location}
                <span>{courier.zone}</span>
              </h1>
              <div className="flex items-center justify-center p-2 rounded-xl bg-light dark:bg-dark_border w-auto h-auto gap-5">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  width={20}
                  height={20}
                  className="text-emerald-500 dark:text-emerald-300"
                  fill={'none'}
                >
                  <path
                    d="M21 7V12M3 7C3 10.0645 3 16.7742 3 17.1613C3 18.5438 4.94564 19.3657 8.83693 21.0095C10.4002 21.6698 11.1818 22 12 22L12 11.3548"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M15 19C15 19 15.875 19 16.75 21C16.75 21 19.5294 16 22 15"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M8.32592 9.69138L5.40472 8.27785C3.80157 7.5021 3 7.11423 3 6.5C3 5.88577 3.80157 5.4979 5.40472 4.72215L8.32592 3.30862C10.1288 2.43621 11.0303 2 12 2C12.9697 2 13.8712 2.4362 15.6741 3.30862L18.5953 4.72215C20.1984 5.4979 21 5.88577 21 6.5C21 7.11423 20.1984 7.5021 18.5953 8.27785L15.6741 9.69138C13.8712 10.5638 12.9697 11 12 11C11.0303 11 10.1288 10.5638 8.32592 9.69138Z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M6 12L8 13"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M17 4L7 9"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
                <h1 className="font-black text-lg">17</h1>
              </div>
            </div>
          </div>
        ))}
      </div> */}
    </main>
  );
}
