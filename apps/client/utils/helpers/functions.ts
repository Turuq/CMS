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