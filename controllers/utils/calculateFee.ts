export default function calculateFee(startTime: Date, endTime: Date, rate: number): number {
    const durationInHours = Math.ceil((endTime.getTime() - startTime.getTime()) / (1000 * 60 * 60));
    if (durationInHours <= 1) return rate;
    return rate + (durationInHours - 1) * 30; 
}
