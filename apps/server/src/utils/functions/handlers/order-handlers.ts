import type { ServerWebSocket, Subprocess } from 'bun';
import type { WSContext } from 'hono/ws';
import { orderModel } from '../../../models/order';
import { integrationOrderModel } from '../../../models/integration-order';

// export async function checkUnassignedProcessingOrder({
//   evt,
//   ws,
//   process,
// }: {
//   evt: { message: string; error?: string };
//   ws: ServerWebSocket<unknown>;
//   process: Subprocess;
// }) {
//   if (evt) {
//     console.log(evt);

//     if (
//       ['openingPort', 'portOpen', 'socketOpened', 'portClosed'].includes(
//         evt.message
//       )
//     ) {
//       ws.send(JSON.stringify(evt));
//     } else if (evt.error) {
//       ws.send(JSON.stringify({ error: evt.error }));
//       process.kill();
//     } else {
//       const order = await orderModel
//         .findOne({
//           $and: [
//             { OID: evt.message },
//             { status: 'processing' },
//             {
//               $or: [{ courier: { $exists: false } }, { courier: null }],
//             },
//           ],
//         })
//         .populate({
//           path: 'client',
//           select: 'companyName',
//         })
//         .select('_id OID client customer products status type total createdAt');

//       const integrationOrder = await integrationOrderModel
//         .findOne({
//           $and: [
//             { OID: evt.message },
//             { status: 'processing' },
//             {
//               $or: [{ courier: { $exists: false } }, { courier: null }],
//             },
//           ],
//         })
//         .populate({
//           path: 'client',
//           select: 'companyName',
//         })
//         .select(
//           '_id OID client customer products status type total createdAt provider'
//         );
//       if (!integrationOrder && !order) {
//         console.log('Order Not Found');
//         ws.send(JSON.stringify({ message: 'unableToAssign' }));
//         process.kill();
//       } else {
//         console.log('Order Matched');
//         ws.send(JSON.stringify({ order: order || integrationOrder }));
//         process.kill();
//       }
//     }

//     if (evt.message === 'portClosed') {
//       process.kill();
//     }
//   }
// }

export async function checkUnassignedProcessingOrder({
  code,
  ws,
}: {
  code: string;
  ws: ServerWebSocket<unknown>;
}) {
  const order = await orderModel
    .findOne({
      $and: [
        { OID: code },
        { status: 'processing' },
        {
          $or: [{ courier: { $exists: false } }, { courier: null }],
        },
      ],
    })
    .populate({
      path: 'client',
      select: 'companyName',
    })
    .select('_id OID client customer products status type total createdAt');

  const integrationOrder = await integrationOrderModel
    .findOne({
      $and: [
        { OID: code },
        { status: 'processing' },
        {
          $or: [{ courier: { $exists: false } }, { courier: null }],
        },
      ],
    })
    .populate({
      path: 'client',
      select: 'companyName',
    })
    .select(
      '_id OID client customer products status type total createdAt provider'
    );

  if (!integrationOrder && !order) {
    console.log('Order Not Found');
    ws.send(JSON.stringify({ message: 'unableToAssign' }));
  } else {
    console.log('Order Matched');
    ws.send(JSON.stringify({ order: order || integrationOrder }));
  }
}

export async function checkAssignedProcessingOrder({
  code,
  courierId,
  ws,
}: {
  code: string;
  courierId: string;
  ws: ServerWebSocket<unknown>;
}) {
  console.log(courierId)
  const order = await orderModel
    .findOne({
      $and: [
        { OID: code },
        { status: 'processing' },
        {
          courier: courierId,
        },
      ],
    })
    .populate({
      path: 'client',
      select: 'companyName',
    })
    .select('_id OID client customer products status type total createdAt');

  const integrationOrder = await integrationOrderModel
    .findOne({
      $and: [
        { OID: code },
        { status: 'processing' },
        {
          courier: courierId,
        },
      ],
    })
    .populate({
      path: 'client',
      select: 'companyName',
    })
    .select(
      '_id OID client customer products status type total createdAt provider'
    );
  if (!integrationOrder && !order) {
    console.log('Order Not Found');
    ws.send(JSON.stringify({ message: 'unableToAssign' }));
  } else {
    console.log('Order Matched');
    ws.send(JSON.stringify({ order: order || integrationOrder }));
  }
}

// export async function checkAssignedProcessingOrder({
//   evt,
//   ws,
//   process,
//   courierId,
// }: {
//   evt: { message: string; error?: string };
//   ws: ServerWebSocket<unknown>;
//   process: Subprocess;
//   courierId: string;
// }) {
//   if (evt) {
//     if (
//       ['openingPort', 'portOpen', 'socketOpened', 'portClosed'].includes(
//         evt.message
//       )
//     ) {
//       ws.send(JSON.stringify(evt));
//     } else if (evt.error) {
//       ws.send(JSON.stringify({ error: evt.error }));
//       process.kill();
//     } else {
//       const order = await orderModel
//         .findOne({
//           $and: [
//             { OID: evt.message },
//             { status: 'processing' },
//             {
//               courier: courierId,
//             },
//           ],
//         })
//         .populate({
//           path: 'client',
//           select: 'companyName',
//         })
//         .select('_id OID client customer products status type total createdAt');

//       const integrationOrder = await integrationOrderModel
//         .findOne({
//           $and: [
//             { OID: evt.message },
//             { status: 'processing' },
//             {
//               courier: courierId,
//             },
//           ],
//         })
//         .populate({
//           path: 'client',
//           select: 'companyName',
//         })
//         .select(
//           '_id OID client customer products status type total createdAt provider'
//         );
//       if (!integrationOrder && !order) {
//         console.log('Order Not Found');
//         ws.send(JSON.stringify({ message: 'unableToAssign' }));
//         process.kill();
//       } else {
//         console.log('Order Matched');
//         ws.send(JSON.stringify({ order: order || integrationOrder }));
//         process.kill();
//       }
//     }

//     if (evt.message === 'portClosed') {
//       process.kill();
//     }
//   }
// }
