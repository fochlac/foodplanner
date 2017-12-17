import {formatDate, formatDayNameDate, formatTime, formatDateTime, formatTimeShort, round } from 'SCRIPTS/date.js';
import { expect } from 'chai';

const second = 1000,
	minute = 60 * second,
	hour = 60 * minute,
	day = 24 * hour,
	tage = ['Sonntag', 'Montag', 'Dienstag', 'Mittwoch', 'Donnerstag', 'Freitag', 'Samstag'];

describe('formatDate', () => {
  it('should format date objects as 01.01.12', () => {

    expect(formatDate(new Date(1231231241000))).to.equal('06.01.09');
    expect(formatDate(new Date(1513978469000))).to.equal('22.12.17');
    expect(formatDate(new Date(1235231241000))).to.equal('21.02.09');
    expect(formatDate(new Date(2235231241000))).to.equal('30.10.40');
    expect(formatDate(new Date(5235231241000))).to.equal('24.11.35');
  });
});

describe('formatDayNameDate', () => {
  it('should format date objects as Freitag, 01.01.12', () => {

    expect(formatDayNameDate(new Date(1231231241000))).to.equal('Dienstag, 06.01.09');
    expect(formatDayNameDate(new Date(1513978469000))).to.equal('Freitag, 22.12.17');
    expect(formatDayNameDate(new Date(1235231241000))).to.equal('Samstag, 21.02.09');
    expect(formatDayNameDate(new Date(2235231241000))).to.equal('Dienstag, 30.10.40');
    expect(formatDayNameDate(new Date(5235231241000))).to.equal('Donnerstag, 24.11.35');
  });
});

describe('formatTime', () => {
  it('should format date objects as 09:40', () => {

    expect(formatTime(new Date(1231231241000))).to.equal('09:40');
    expect(formatTime(new Date(1513978469000))).to.equal('22:34');
    expect(formatTime(new Date(1235231241000))).to.equal('16:47');
    expect(formatTime(new Date(2235231241000))).to.equal('18:34');
    expect(formatTime(new Date(5235231241000))).to.equal('23:54');
  });
});

describe('formatDateTime', () => {
  it('should format date objects as 01.01.12 - 09:40', () => {

    expect(formatDateTime(new Date(1231231241000))).to.equal('06.01.09 - 09:40');
    expect(formatDateTime(new Date(1513978469000))).to.equal('22.12.17 - 22:34');
    expect(formatDateTime(new Date(1235231241000))).to.equal('21.02.09 - 16:47');
    expect(formatDateTime(new Date(2235231241000))).to.equal('30.10.40 - 18:34');
    expect(formatDateTime(new Date(5235231241000))).to.equal('24.11.35 - 23:54');
  });
});

describe('formatTimeShort', () => {
  it('should format date objects depending on time distance', () => {

  	let src1 = new Date(Date.now() - 5 * day),
  		src2 = new Date(Date.now() + 5 * day);
  	src1.setHours(0);
  	src1.setMinutes(0);
  	src2.setHours(0);
  	src2.setMinutes(0);

    expect(formatTimeShort(new Date(1231231241000))).to.equal('06.01.2009 09:40');

    expect(formatTimeShort(src1)).to.equal('letzten ' + tage[src1.getDay()] + ', 00:00' );
    expect(formatTimeShort(new Date(Date.now() - 13 * hour - 10 * minute))).to.equal('vor 13 Stunden');
    expect(formatTimeShort(new Date(Date.now() - 1 * hour - 10 * minute))).to.equal('vor 1 Stunde');
    expect(formatTimeShort(new Date(Date.now() - 10 * minute - 30 * second))).to.equal('vor 10 Minuten');
    expect(formatTimeShort(new Date(Date.now() - 1 * minute - 30 * second))).to.equal('vor 1 Minute');

    expect(formatTimeShort(new Date(Date.now() + 13 * hour - 10 * minute))).to.equal('in 13 Stunden');
    expect(formatTimeShort(new Date(Date.now() + 1 * hour + 10 * minute))).to.equal('in 1 Stunde');
    expect(formatTimeShort(new Date(Date.now() + 10 * minute - 30 * second))).to.equal('in 10 Minuten');
    expect(formatTimeShort(new Date(Date.now() + 1 * minute - 30 * second))).to.equal('in 1 Minute');
    expect(formatTimeShort(src2)).to.equal(tage[src2.getDay()] + ', 00:00' );

    expect(formatTimeShort(new Date(5235231241000))).to.equal('24.11.2135 23:54');
  });
});

describe('round', () => {
  it('should format date objects depending on time distance', () => {

    expect(round(1231231241000, 100).getTime()).to.equal(1231231200000);
    expect(round(1513978469000, 100).getTime()).to.equal(1513978500000);
    expect(round(1235231241000, 100).getTime()).to.equal(1235231200000);
    expect(round(2235231241000, 100).getTime()).to.equal(2235231200000);
    expect(round(5235231241000, 100).getTime()).to.equal(5235231200000);
  });
});
