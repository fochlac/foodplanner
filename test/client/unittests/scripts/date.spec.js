import { formatDate, formatDateTime, formatDayNameDate, formatDayShort, formatTime, formatTimeShort, round } from 'UTILS/date.js'

const second = 1000,
  minute = 60 * second,
  hour = 60 * minute,
  day = 24 * hour,
  tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'],
  handleTimeOffset = (str, date) => {
    let hour = str.match(/([0-9][0-9]):([0-9][0-9])/),
      offset = new Date(date).getTimezoneOffset() / 60

    return str.replace(hour[0], ('00' + (+hour[1] - offset)).slice(-2) + ':' + hour[2])
  }

describe('formatDate', () => {
  test('should format date objects as 01.01.12', () => {
    expect(formatDate(new Date(1231231241000))).toBe('06.01.09')
    expect(formatDate(new Date(1513978469000))).toBe('22.12.17')
    expect(formatDate(new Date(1235231241000))).toBe('21.02.09')
    expect(formatDate(new Date(2235231241000))).toBe('30.10.40')
    expect(formatDate(new Date(5235231241000))).toBe('24.11.35')
  })
})

describe('formatDayNameDate', () => {
  test('should format date objects as Freitag, 01.01.12', () => {
    expect(formatDayNameDate(new Date(1231231241000))).toBe('Dienstag, 06.01.09')
    expect(formatDayNameDate(new Date(1513978469000))).toBe('Freitag, 22.12.17')
    expect(formatDayNameDate(new Date(1235231241000))).toBe('Samstag, 21.02.09')
    expect(formatDayNameDate(new Date(2235231241000))).toBe('Dienstag, 30.10.40')
    expect(formatDayNameDate(new Date(5235231241000))).toBe('Donnerstag, 24.11.35')
  })
})

describe('formatDayShort', () => {
  test('should format date objects as Freitag, 01.01.12', () => {
    expect(formatDayShort(1231231241000)).toBe('Di')
    expect(formatDayShort(1513978469000)).toBe('Fr')
    expect(formatDayShort(1235231241000)).toBe('Sa')
    expect(formatDayShort(new Date(2235231241000))).toBe('Di')
    expect(formatDayShort(new Date(5235231241000))).toBe('Do')
  })
})

describe('formatTime', () => {
  test('should format date objects as 09:40', () => {
    expect(formatTime(new Date(1231231241000))).toBe(handleTimeOffset('08:40', 1231231241000))
    expect(formatTime(new Date(1513978469000))).toBe(handleTimeOffset('21:34', 1513978469000))
    expect(formatTime(new Date(1235231241000))).toBe(handleTimeOffset('15:47', 1235231241000))
    expect(formatTime(new Date(2235231241000))).toBe(handleTimeOffset('17:34', 2235231241000))
    expect(formatTime(new Date(5235231241000))).toBe(handleTimeOffset('22:54', 5235231241000))
  })
})

describe('formatDateTime', () => {
  test('should format date objects as 01.01.12 - 09:40', () => {
    expect(formatDateTime(new Date(1231231241000))).toBe(handleTimeOffset('06.01.09 - 08:40', 1231231241000))
    expect(formatDateTime(new Date(1513978469000))).toBe(handleTimeOffset('22.12.17 - 21:34', 1513978469000))
    expect(formatDateTime(new Date(1235231241000))).toBe(handleTimeOffset('21.02.09 - 15:47', 1235231241000))
    expect(formatDateTime(new Date(2235231241000))).toBe(handleTimeOffset('30.10.40 - 17:34', 2235231241000))
    expect(formatDateTime(new Date(5235231241000))).toBe(handleTimeOffset('24.11.35 - 22:54', 5235231241000))
  })
})

describe('formatTimeShort', () => {
  test('should format date objects depending on time distance', () => {
    let src1 = new Date(Date.now() - 5 * day),
      src2 = new Date(Date.now() + 5 * day)
    src1.setHours(0)
    src1.setMinutes(0)
    src2.setHours(0)
    src2.setMinutes(0)

    expect(formatTimeShort(new Date(1231231241000))).toBe(handleTimeOffset('06.01.2009 08:40', 1231231241000))

    expect(formatTimeShort(src1)).toBe('letzten ' + tage[src1.getDay()] + ', 00:00')
    expect(formatTimeShort(new Date(Date.now() - 13 * hour - 10 * minute))).toBe('vor 13 Stunden')
    expect(formatTimeShort(new Date(Date.now() - 1 * hour - 10 * minute))).toBe('vor 1 Stunde')
    expect(formatTimeShort(new Date(Date.now() - 10 * minute - 30 * second))).toBe('vor 10 Minuten')
    expect(formatTimeShort(new Date(Date.now() - 1 * minute - 30 * second))).toBe('vor 1 Minute')

    expect(formatTimeShort(new Date(Date.now() + 13 * hour - 10 * minute))).toBe('in 13 Stunden')
    expect(formatTimeShort(new Date(Date.now() + 1 * hour + 10 * minute))).toBe('in 1 Stunde')
    expect(formatTimeShort(new Date(Date.now() + 10 * minute - 30 * second))).toBe('in 10 Minuten')
    expect(formatTimeShort(new Date(Date.now() + 1 * minute - 30 * second))).toBe('in 1 Minute')
    expect(formatTimeShort(src2)).toBe(tage[src2.getDay()] + ', 00:00')

    expect(formatTimeShort(new Date(5235231241000))).toBe(handleTimeOffset('24.11.2135 22:54', 5235231241000))
  })
})

describe('round', () => {
  test('should format date objects depending on time distance', () => {
    expect(round(1231231241000, 100).getTime()).toBe(1231231200000)
    expect(round(1513978469000, 100).getTime()).toBe(1513978500000)
    expect(round(1235231241000, 100).getTime()).toBe(1235231200000)
    expect(round(2235231241000, 100).getTime()).toBe(2235231200000)
    expect(round(5235231241000, 100).getTime()).toBe(5235231200000)
  })
})
