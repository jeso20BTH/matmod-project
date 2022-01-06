let utils = {
    calculateDays: (start, end) => {
        let mili2sec = 1000;
        let sec2min = 60;
        let min2hour = 60
        let hour2days = 24

        start = new Date(start);
        end = new Date(end);

        let miliseconds = end - start;
        let seconds = miliseconds / mili2sec;
        let minutes = seconds / sec2min;
        let hours = minutes / min2hour;
        let days = hours / hour2days;
        return Math.round(days)
    }
}

module.exports = utils
