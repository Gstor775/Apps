// Calculate pace as min/km or min/mi, returns "min:sec"
export const calculatePace = (distance: number, timeInSeconds: number): string => {
    if (timeInSeconds === 0 || distance === 0) return "0:00";
    const paceInSeconds = timeInSeconds / distance;
    const minutes = Math.floor(paceInSeconds / 60);
    const seconds = Math.round(paceInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
};

// Estimate calorie burn (supports kg or lbs, MET value for running ~8)
// If units = 'kg', weight is in kg; if 'lb', weight is in pounds
export const estimateCalorieBurn = (
    weight: number,
    durationInMinutes: number,
    units: 'kg' | 'lb' = 'kg'
): number => {
    const weightKg = units === 'lb' ? weight * 0.453592 : weight;
    const caloriesBurnedPerMinute = 0.0175 * 8 * weightKg;
    return Math.round(caloriesBurnedPerMinute * durationInMinutes);
};

// Convert distance between miles and kilometers
export const convertDistance = (
    distance: number,
    from: 'mi' | 'km',
    to: 'mi' | 'km'
): number => {
    if (from === to) return distance;
    return from === 'mi' ? distance * 1.60934 : distance / 1.60934;
};

// Format time as "Hh Mm Ss"
export const formatTime = (totalSeconds: number): string => {
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    return `${hours}h ${minutes}m ${seconds}s`;
};