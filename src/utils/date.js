import PersianDate from "./PersianDate";

const goToNextDay = (currentDate, setCurrentDate, notification) => {
    const today = PersianDate.today();
    if (currentDate.sameDay(today)) {
        new notification('alert', 'You can\'t select days after today');
        return;
    }
    setCurrentDate(currentDate.nextDay());
}

const goToPreviousDay = (currentDate, setCurrentDate) => {
    setCurrentDate(currentDate.previousDay());
}
const dateInputKeyDownHandler = (e, currentDate, setCurrentDate, notification) => {
    e.preventDefault();
    switch (e.key) {
        case 'ArrowUp':
            goToNextDay(currentDate, setCurrentDate, notification);
            break;
        case 'ArrowDown':
            goToPreviousDay(currentDate, setCurrentDate);
            break;
        default:
            break;
        }
}
export {
    goToNextDay,
    goToPreviousDay,
    dateInputKeyDownHandler,
}

