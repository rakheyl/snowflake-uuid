'use strict';

export type NumberOrBigInt = number | bigint;

export interface WorkerOptions {
	epoch?: NumberOrBigInt;
	workerIdBits?: NumberOrBigInt;
	datacenterIdBits?: NumberOrBigInt;
	sequence?: NumberOrBigInt;
	sequenceBits?: NumberOrBigInt;
}

export class Worker {
	public readonly epoch: bigint;
	public readonly workerId: bigint;
	public readonly workerIdBits: bigint;
	public readonly maxWorkerId: bigint;
	public readonly datacenterId: bigint;
	public readonly datacenterIdBits: bigint;
	public readonly maxDatacenterId: bigint;
	protected sequence: bigint;
	public readonly sequenceBits: bigint;
	public readonly workerIdShift: bigint;
	public readonly datacenterIdShift: bigint;
	public readonly timestampLeftShift: bigint;
	public readonly sequenceMask: bigint;
	protected timestamp: bigint = -1n;

	public constructor(workerId: NumberOrBigInt = 0n, datacenterId: NumberOrBigInt = 0n, options?: WorkerOptions) {
		// Epoch
		this.epoch = BigInt(options?.epoch ?? 1609459200000);

		// Worker
		this.workerId = BigInt(workerId);
		this.workerIdBits = BigInt(options?.workerIdBits ?? 5);
		this.maxWorkerId = -1n ^ (-1n << this.workerIdBits);
		if (this.workerId < 0 || this.workerId > this.maxWorkerId) {
			throw new Error(`With ${this.workerIdBits} bits, worker id can't be greater than ${this.maxWorkerId} or less than 0`);
		}

		// Datacenter
		this.datacenterId = BigInt(datacenterId);
		this.datacenterIdBits = BigInt(options?.datacenterIdBits ?? 5);
		this.maxDatacenterId = -1n ^ (-1n << this.datacenterIdBits);
		if (this.datacenterId > this.maxDatacenterId || this.datacenterId < 0) {
			throw new Error(`With ${this.datacenterIdBits} bits, datacenter id can't be greater than ${this.maxDatacenterId} or less than 0`);
		}

		// Sequence
		this.sequence = BigInt(options?.sequence ?? 0);
		this.sequenceBits = BigInt(options?.sequenceBits ?? 12);
		this.sequenceMask = -1n ^ (-1n << this.sequenceBits);

		// Shift
		this.workerIdShift = this.sequenceBits;
		this.datacenterIdShift = this.sequenceBits + this.workerIdBits;
		this.timestampLeftShift = this.sequenceBits + this.workerIdBits + this.datacenterIdBits;
	}

	public get currentSequence(): bigint {
		return this.sequence;
	}

	public get lastTimestamp(): bigint {
		return this.timestamp;
	}

	public nextId(): bigint {
		let timestamp = Worker.now();

		if (timestamp < this.timestamp) {
			throw new Error(`Clock moved backwards. Can't generate new ID for ${this.timestamp - timestamp} milliseconds.`);
		}

		if (timestamp === this.timestamp) {
			this.sequence = (this.sequence + 1n) & this.sequenceMask;
			if (this.sequence === 0n) {
				timestamp = Worker.untilNextMillis(this.timestamp);
			}
		} else {
			this.sequence = 0n;
		}

		this.timestamp = timestamp;

		return (
			((timestamp - this.epoch) << this.timestampLeftShift) |
			(this.datacenterId << this.datacenterIdShift) |
			(this.workerId << this.workerIdShift) |
			this.sequence
		);
	}

	public static untilNextMillis(lastTimestamp: bigint): bigint {
		let timestamp;

		do {
			timestamp = Worker.now();
		} while (timestamp <= lastTimestamp);

		return timestamp;
	}

	public static now(): bigint {
		return BigInt(Date.now());
	}
}
