export const extractAlarmEmail = (alarmName: string) => {
    const index = alarmName.indexOf("-");
    if (index !== -1) {
        return alarmName.slice(index + 1);
    }
    return "";
};
