class SpeedRate {
    constructor() {
        this.speedRate = 1;
    }

    set(value) {
        this.speedRate = value;
    }

    get() {
        return this.speedRate;
    }
}

const speedRateInstance = new SpeedRate();
export default speedRateInstance;