import { SerialPortStream } from '@serialport/stream';
import { autoDetect } from '@serialport/bindings-cpp';
import { DelimiterParser } from '@serialport/parser-delimiter';

console.log(`Scanner process started with PID: ${process.pid}`);

const Binding = autoDetect();
const bindings = await Binding.list();
const binding = bindings.find(
  (binding) => binding.pnpId === 'USB\\VID_05F9&PID_4204\\S/N_G21N69335'
);

const port = new SerialPortStream({
  path: binding?.path,
  baudRate: 9600,
  autoOpen: false,
  binding: autoDetect(),
});

if (!port.isOpen) {
  process.send({ message: 'openingPort' });
  port.open();
}

port.on('open', () => {
  console.log(`Scanner port: ${port.path} opened`);
  process.send({ message: 'portOpen' });
  // Close port after 10 minutes of inactivity
  setTimeout(() => {
    port.close();
  }, 600000);
  // Close port after 5 seconds of inactivity
  // setTimeout(() => {
  //   port.close();
  // }, 5000);
});

const parser = port.pipe(new DelimiterParser({ delimiter: '\r' }));

parser.on('data', (data) => {
  console.log(data.toString('utf8'));
  process.send({ message: data.toString('utf8') });
  port.close();
});

parser.on('error', (err) => {
  console.error(err);
  port.close();
  process.send({ error: 'Parser error' });
  process.exit(1);
});

port.on('close', () => {
  process.send({ message: 'portClosed' });
  process.exit();
});

port.on('error', (err) => {
  console.error(err);
  port.close();
  process.send({ error: 'Port already open' });
  process.exit(1);
});
