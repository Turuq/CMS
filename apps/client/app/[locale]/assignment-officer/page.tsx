'use client';
import KpiCard from '@/components/cards/kpi-card';
import { useDictionary } from '@/providers/dictionary-provider';
import {
  processingOrdersStatisticsPerGovernorate,
  outForDeliveryOrdersStatisticsPerZone,
} from '@/utils/data/dummy';

type Governorate = keyof typeof processingOrdersStatisticsPerGovernorate;
type Zone = keyof typeof outForDeliveryOrdersStatisticsPerZone;

export default function AssignmentOfficerHome() {
  const { dictionary } = useDictionary();
  const headerGovernorate =
    dictionary['assignmentOfficer']['tabs']['home'][
      'processingOrdersStatistics'
    ]['header'];
  const headerZone =
    dictionary['assignmentOfficer']['tabs']['home'][
      'outForDeliveryOrdersStatistics'
    ]['header'];
  const titlesGovernorate =
    dictionary['assignmentOfficer']['tabs']['home'][
      'processingOrdersStatistics'
    ]['governorate'];
  const titlesZone =
    dictionary['assignmentOfficer']['tabs']['home'][
      'outForDeliveryOrdersStatistics'
    ]['zone'];

  return (
    <main className="flex min-h-screen flex-col gap-5 w-full">
      <h1 className="text-3xl font-bold opacity-80">{headerGovernorate}</h1>
      <div className="grid grid-cols-12 gap-5">
        {Object.keys(processingOrdersStatisticsPerGovernorate).map((gov) => (
          <div key={gov} className="col-span-6 lg:col-span-4">
            <KpiCard
              title={titlesGovernorate[gov]}
              statistic={
                processingOrdersStatisticsPerGovernorate[gov as Governorate]
              }
              color="warning"
            />
          </div>
        ))}
      </div>

      <h1 className="text-3xl font-bold opacity-80">{headerZone}</h1>
      <div className="grid grid-cols-12 gap-5">
        {Object.keys(outForDeliveryOrdersStatisticsPerZone).map((zone) => (
          <div key={zone} className="col-span-6 lg:col-span-4">
            <KpiCard
              title={titlesZone[zone]}
              statistic={outForDeliveryOrdersStatisticsPerZone[zone as Zone]}
            />
          </div>
        ))}
      </div>
    </main>
  );
}
