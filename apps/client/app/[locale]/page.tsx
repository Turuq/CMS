'use client';

import SignInPage from './sign-in/sign-in-component';

export default function Page() {
  // const [data, setData] = useState('');

  // async function handleBarcodeScan() {
  //   if ('serial' in navigator) {
  //     const port = await navigator.serial.requestPort();
  //     await port.open({ baudRate: 9600 });

  //     if (port) {
  //       while (port.readable) {
  //         const textDecoder = new TextDecoderStream();
  //         const readableStreamClosed = port.readable.pipeTo(
  //           textDecoder.writable
  //         );
  //         const reader = textDecoder.readable.getReader();
  //         try {
  //           let currentBarcode = '';
  //           while (true) {
  //             try {
  //               const { value, done } = await reader.read();
  //               if (done) {
  //                 // Allow the serial port to be closed later.
  //                 console.log('done');
  //                 reader.releaseLock();
  //                 break;
  //               }
  //               currentBarcode += value;
  //               if (currentBarcode.endsWith('\r')) {
  //                 const scannedBarcode = currentBarcode.trim();
  //                 setData(scannedBarcode);
  //                 currentBarcode = '';
  //                 ws.send(
  //                   JSON.stringify({
  //                     message: 'assign-processing-unassigned',
  //                     data: scannedBarcode,
  //                   })
  //                 );
  //               }
  //             } catch (error) {
  //               console.error('Error reading:', error);
  //               readableStreamClosed.catch(() => {});
  //               reader.releaseLock();
  //               port.close();
  //             }
  //           }
  //         } catch (error) {
  //           console.error('Error reading:', error);
  //         } finally {
  //           reader.releaseLock();
  //         }
  //       }
  //     }
  //   } else {
  //     toast.error('Web Serial API not supported.', {
  //       style: ToastStyles.error,
  //     });
  //   }
  // }

  // useEffect(() => {
  //   ws.onmessage = (message) => {
  //     console.log(message);
  //   };
  // }, []);

  return (
    <div className="flex flex-col items-center justify-center w-full h-full">
      <SignInPage />
    </div>
  );
}
