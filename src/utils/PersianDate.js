class PersianDate {
    constructor(year, month, day, dayNumber) {
        if (year < 1 || month < 1 || month > 12 || day < 1 || day > 31 ||
            (month > 6 && day > 30) ||
            (month === 12 && day > 29 && year % 4 !== 3)
        ) {
            throw new Error(`Invalid date ${year}/${month}/${day}`);
        }
        this.setDate(year, month, day, dayNumber);
    }
    nextDay() {
        const newDate = this.copy();
        newDate.day++;
        newDate.dayNumber = (newDate.dayNumber + 1) % 7;
        if (newDate.day > newDate.monthDays) {
            if (newDate.month === 12) newDate.setDate(newDate.year + 1, 1, 1);
            else newDate.setDate(newDate.year, newDate.month + 1, 1);
        }
        newDate._updateInformation();
        return newDate;
    }
    previousDay() {
        const newDate = this.copy();
        newDate.day--;
        newDate.dayNumber = newDate.dayNumber > 0 ? newDate.dayNumber - 1 : 6;
        if (newDate.day < 1) {
            if (newDate.month === 1) newDate.setDate(newDate.year - 1, 12, newDate.isLeapYear(newDate.year - 1) ? 30 : 29)
            else {
                newDate.month--;
                newDate.day = newDate.getMonthDays();
            }
        }
        newDate._updateInformation();
        return newDate;
    }
    nextMonth() {
        const newDate = this.copy();
        newDate.month++;
        if (newDate.month > 12) {
            newDate.month = 1;
            newDate.year++;
        }
        if (newDate.day > newDate.getMonthDays()) newDate.day = newDate.getMonthDays();
        newDate.dayNumber = (newDate.dayNumber + (this.monthDays % 7) + (newDate.day - this.day)) % 7;
        newDate._updateInformation();
        return newDate;
    }
    previousMonth() {
        const newDate = this.copy();
        newDate.month--;
        if (newDate.month < 1) {
            newDate.month = 12;
            newDate.year--;
        }
        if (newDate.day > newDate.getMonthDays()) newDate.day = newDate.getMonthDays();
        const newDayNumber = newDate.dayNumber - ((newDate.getMonthDays() - newDate.day + this.day) % 7);
        newDate.dayNumber = newDayNumber < 0 ? newDayNumber + 7 : newDayNumber;
        newDate._updateInformation();
        return newDate;
    }
    nextWeek() {
        let currentDay = this.copy();
        for (let a = 0 ; a < 7 ; a++) currentDay = currentDay.nextDay();
        return currentDay;
    }
    previousWeek() {
        let currentDay = this.copy();
        for (let a = 0 ; a < 7 ; a++) currentDay = currentDay.previousDay();
        return currentDay;
    }
    getWeekDays() {
        let currentDay = this.copy();
        while (currentDay.dayNumber > 0) currentDay = currentDay.previousDay();
        const weekDays = [];
        for (let a = 0 ; a < 7 ; a++) {
            weekDays.push(currentDay.copy());
            currentDay = currentDay.nextDay();
        }
        return weekDays;
    }
    setDate(year, month, day, dayNumber = null) {
        this.year = year;
        this.month = month;
        this.day = day;
        dayNumber !== null && (this.dayNumber = dayNumber);
        this._updateInformation();
    }
    sameDay(otherDay) {
        return (
            otherDay.day === this.day &&
            otherDay.month === this.month &&
            otherDay.year === this.year
        )
    }
    toString() {
        return `${this.day} ${this.monthName} ${this.year}`;
    }
    toStringDayMonth() {
        return `${this.day} ${this.monthName}`;
    }
    toDate() {
        return `${this.year.toString()}/${this.month.toString().padStart(2, '0')}/${this.day.toString().padStart(2, '0')}`
    }
    copy() {
        return new PersianDate(this.year, this.month, this.day, this.dayNumber);
    }
    getMonthDays() {
        if (this.month <= 6) return 31;
        if (this.month < 12) return 30;
        return this.isLeapYear() ? 30 : 29;
    }
    isLeapYear(newYear = this.year) {
        return newYear % 4 === 3;
    }
    _updateInformation() {
        this.dayName = weekDays[this.dayNumber];
        this.monthName = persianMonths[this.month - 1];
        this.monthDays = this.getMonthDays();
    }
}

PersianDate.today = () => {
    const today = new Intl.DateTimeFormat("fa").format(Date.now()).split("/").map(time => FatoEn(time));
    const dayNumber = (new Date().getDay() + 1) % 7;
    return new PersianDate(...today, dayNumber);
}

const weekDays = ['شنبه', 'یکشنبه', 'دوشنبه', 'سه‌شنبه', 'چهارشنبه', 'پنج‌شنبه', 'جمعه'];
const persianMonths = ['فروردین', 'اردیبهشت', 'خرداد', 'تیر', 'مرداد', 'شهریور', 'مهر', 'آبان', 'آذر', 'دی', 'بهمن', 'اسفند']
const persianNumbers = ['۰', '۱', '۲', '۳', '۴', '۵', '۶', '۷', '۸', '۹'];

const FatoEn = faNumber => {
    let enNumberString = '';
    for (let digit of faNumber)
        enNumberString += persianNumbers.indexOf(digit);
    return parseInt(enNumberString);
}

export default PersianDate;
export {
    weekDays,
    persianMonths
};