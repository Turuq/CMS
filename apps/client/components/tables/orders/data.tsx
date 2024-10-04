// This is an example of how the columns file for a table should look like
// Types such as Customer, Product & Order may be reused in other tables
// So they should be defined in a separate file located in the `types folder` and imported here

export type Customer = {
  name: string;
  address: string;
  phone: string;
  governorate: string;
};

export type Product = {
  UID: string;
  itemDescription: string;
  price: number;
  quantity: number;
  returned: boolean;
};

export type Order = {
  OID: string;
  customer: Customer;
  products: Product[];
  status: string;
  type: "REFUND" | "EXCHANGE" | "PROMOTIONAL" | "NORMAL";
  subtotal: number;
  shippingFees: number;
  total: number;
  createdAt: Date;
};

// This is an example of how the fetched data would look like
// Excluding any unnecessary fields
export const Orders: Order[] = [
  {
    OID: "1",
    customer: {
      name: "Ahmed",
      address: "Cairo, Egypt",
      phone: "01000000000",
      governorate: "Cairo",
    },
    products: [
      {
        UID: "1",
        itemDescription: "Product 1",
        price: 100,
        quantity: 2,
        returned: false,
      },
      {
        UID: "2",
        itemDescription: "Product 2",
        price: 200,
        quantity: 1,
        returned: false,
      },
    ],
    status: "SHIPPED",
    type: "NORMAL",
    subtotal: 400,
    shippingFees: 50,
    total: 450,
    createdAt: new Date(),
  },
  {
    OID: "2",
    customer: {
      name: "Mohamed",
      address: "Giza, Egypt",
      phone: "01111111111",
      governorate: "Giza",
    },
    products: [
      {
        UID: "3",
        itemDescription: "Product 3",
        price: 300,
        quantity: 1,
        returned: false,
      },
      {
        UID: "4",
        itemDescription: "Product 4",
        price: 400,
        quantity: 1,
        returned: false,
      },
    ],
    status: "DELIVERED",
    type: "NORMAL",
    subtotal: 700,
    shippingFees: 100,
    total: 800,
    createdAt: new Date(),
  },
  {
    OID: "3",
    customer: {
      name: "Ali",
      address: "Alexandria, Egypt",
      phone: "01222222222",
      governorate: "Alexandria",
    },
    products: [
      {
        UID: "5",
        itemDescription: "Product 5",
        price: 500,
        quantity: 1,
        returned: false,
      },
      {
        UID: "6",
        itemDescription: "Product 6",
        price: 600,
        quantity: 1,
        returned: false,
      },
    ],
    status: "SHIPPED",
    type: "NORMAL",
    subtotal: 1100,
    shippingFees: 150,
    total: 1250,
    createdAt: new Date(),
  },
  {
    OID: "4",
    customer: {
      name: "Ahmed",
      address: "Cairo, Egypt",
      phone: "01000000000",
      governorate: "Cairo",
    },
    products: [
      {
        UID: "1",
        itemDescription: "Product 1",
        price: 100,
        quantity: 2,
        returned: false,
      },
      {
        UID: "2",
        itemDescription: "Product 2",
        price: 200,
        quantity: 1,
        returned: false,
      },
    ],
    status: "SHIPPED",
    type: "NORMAL",
    subtotal: 400,
    shippingFees: 50,
    total: 450,
    createdAt: new Date(),
  },
  {
    OID: "5",
    customer: {
      name: "Mohamed",
      address: "Giza, Egypt",
      phone: "01111111111",
      governorate: "Giza",
    },
    products: [
      {
        UID: "3",
        itemDescription: "Product 3",
        price: 300,
        quantity: 1,
        returned: false,
      },
      {
        UID: "4",
        itemDescription: "Product 4",
        price: 400,
        quantity: 1,
        returned: false,
      },
    ],
    status: "DELIVERED",
    type: "NORMAL",
    subtotal: 700,
    shippingFees: 100,
    total: 800,
    createdAt: new Date(),
  },
  {
    OID: "6",
    customer: {
      name: "Ali",
      address: "Alexandria, Egypt",
      phone: "01222222222",
      governorate: "Alexandria",
    },
    products: [
      {
        UID: "5",
        itemDescription: "Product 5",
        price: 500,
        quantity: 1,
        returned: false,
      },
      {
        UID: "6",
        itemDescription: "Product 6",
        price: 600,
        quantity: 1,
        returned: false,
      },
    ],
    status: "SHIPPED",
    type: "NORMAL",
    subtotal: 1100,
    shippingFees: 150,
    total: 1250,
    createdAt: new Date(),
  },
];
