export type CourierType = {
  id: string;
  name: string;
  username: string;
  phoneNumber: string;
  salary: number;
  zone: string;
  commissionPerOrder: number;
  nationalIDImage: string;
  criminalRecord: string;
};

export type CourierColumns = {
  name: string;
  username: string;
  nationalID: string;
  joinedAt: string;
};
