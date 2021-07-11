'use strict';

export function nowTimestamp() {
  return new Date().toISOString();
};

export const dateDifferenceInSeconds = (endDate, startDate) => {
  if (!endDate || !startDate) {
    return 0;
  }
  const durationInMilliseconds = Math.abs(new Date(endDate).getTime() - new Date(startDate).getTime());
  return Math.ceil(durationInMilliseconds / 1000);
};

// export const secondsToHoursMinutesSeconds = (seconds) => {
//   const hours = Math.floor(seconds / 3600);
//   const minutes = Math.floor(seconds % 3600 / 60);
//   seconds = Math.floor(seconds % 3600 % 60);
//   return { hours, minutes, seconds };
// };

// export const dateDifferenceInHoursMinutesSeconds = (endDate, startDate) => {
//   const differenceInSeconds = dateDifferenceInSeconds(endDate, startDate);
//   return secondsToHoursMinutesSeconds(differenceInSeconds);
// };
