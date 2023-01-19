import {
  add,
  closestTo,
  formatDuration,
  intervalToDuration,
  isFriday,
  isTuesday,
  nextFriday,
  nextTuesday,
  previousFriday,
  previousTuesday,
  startOfDay,
} from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';

export const getTimeOfDay = () => {
  const hour = new Date().getHours();

  if (hour < 12) {
    return 'Umaga';
  } else if (hour < 13) {
    return 'Tanghali';
  } else if (hour < 18) {
    return 'Hapon';
  } else if (hour <= 23) {
    return 'Gabi';
  }

  return 'Araw';
};

export const getPhTime = () => utcToZonedTime(new Date(), 'Asia/Manila');

export const getDurationToNextDay = () => {
  const phTime = getPhTime();

  return intervalToDuration({
    start: phTime,
    end: startOfDay(add(phTime, { days: 1 })),
  });
};

export const getHexGameDate = (date: Date = getPhTime()) => {
  if (isTuesday(date) || isFriday(date)) {
    return date;
  }

  return closestTo(date, [previousTuesday(date), previousFriday(date)]);
};

export const getNextHexGameDate = (date: Date = getPhTime()) => {
  return closestTo(date, [nextTuesday(date), nextFriday(date)]) as Date;
};

export const getDurationToNextHexGame = () => {
  const phTime = getPhTime();

  return intervalToDuration({
    start: phTime,
    end: getNextHexGameDate(phTime),
  });
};

export const formatShortDuration = (duration: Duration) =>
  formatDuration(duration)
    .replace(' days', 'd')
    .replace(' hours', 'h')
    .replace(' minutes', 'm')
    .replace(' seconds', 's');
