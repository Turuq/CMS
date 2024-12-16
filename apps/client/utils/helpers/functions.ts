import { ws } from '@/app/actions/api';
import { Dispatch, SetStateAction } from 'react';

// pad zeros to OID to have a length of 13 characters
export function padOID(oid: string) {
  return oid.padStart(13, '0');
}

export function formatBytes(bytes: number, decimals = 2) {
  const units = ['B', 'KB', 'MB', 'GB', 'TB', 'PB', 'EB', 'ZB', 'YB'];
  const index = Math.floor(Math.log(bytes) / Math.log(1024));
  const formattedValue = (bytes / Math.pow(1024, index)).toFixed(decimals);

  return `${formattedValue} ${units[index]}`;
}

export function getBatchProgress(
  progress: number,
  totalNumberOfOrders: number
) {
  return (progress / totalNumberOfOrders) * 100;
}

export async function scanOrders({
  endpoint,
  feedback,
  keepScanning,
  port,
  courierId,
}: {
  endpoint:
    | 'assign-processing-unassigned'
    | 'handover-processing-assigned'
    | 'reship-toBeReshipped-orders';
  feedback: Dispatch<
    SetStateAction<{
      [key: string]: string | boolean;
    }>
  >;
  keepScanning: boolean;
  port: SerialPort | null;
  courierId?: string;
}) {
  if ('serial' in navigator) {
    feedback((oldValue) => ({ ...oldValue, openingPort: true }));

    if (port?.connected && !keepScanning) {
      await port?.close();
      return;
    }

    if (!port?.connected && keepScanning) {
      await port?.open({ baudRate: 9600 });
    }
    if (port && keepScanning) {
      console.log('port open');
      feedback((oldValue) => ({ ...oldValue, portOpen: true }));
      while (port.readable) {
        const reader = port.readable.getReader();
        let currentBarcode = '';
        try {
          while (true) {
            const { value, done } = await reader.read();
            const textDecoder = new TextDecoder();
            const decodedValue = textDecoder.decode(value);
            if (done) {
              // |reader| has been canceled.
              break;
            }
            currentBarcode += decodedValue;
            if (currentBarcode.endsWith('\r')) {
              const scannedBarcode = currentBarcode.trim();
              reader.releaseLock();
              currentBarcode = '';
              ws.send(
                JSON.stringify({
                  message: endpoint,
                  data: scannedBarcode,
                  courierId:
                    endpoint !== 'assign-processing-unassigned'
                      ? courierId
                      : undefined,
                })
              );
              break;
            }
          }
        } catch (error) {
          console.error('Error reading:', error);
        } finally {
          reader.releaseLock();
        }
      }
      // while (port.readable) {
      //   // const readableStreamClosed = port.readable.pipeTo(textDecoder.writable);
      //   const reader = textDecoder.readable.getReader();
      //   try {
      //     let currentBarcode = '';
      //     while (true) {
      //       try {
      //         const { value, done } = await reader.read();
      //         if (done) {
      //           // Allow the serial port to be closed later.
      //           console.log('done');
      //           reader.releaseLock();
      //           break;
      //         }
      //         currentBarcode += value;
      //         if (currentBarcode.endsWith('\r')) {
      //           const scannedBarcode = currentBarcode.trim();
      //           reader.releaseLock();
      //           currentBarcode = '';
      //           ws.send(
      //             JSON.stringify({
      //               message: endpoint,
      //               data: scannedBarcode,
      //               courierId:
      //                 endpoint !== 'assign-processing-unassigned'
      //                   ? courierId
      //                   : undefined,
      //             })
      //           );
      //           break;
      //         }
      //       } catch (error) {
      //         console.error('Error reading:', error);
      //         // readableStreamClosed.catch((e) => {
      //         //   console.error('Stream Close Error: ', e);
      //         // });
      //       }
      //     }
      //   } catch (error) {
      //     console.error('Error reading:', error);
      //   } finally {
      //     reader.releaseLock();
      //   }
      // }
    }
  } else {
    return Promise.reject('Web Serial API not supported.');
  }
}
