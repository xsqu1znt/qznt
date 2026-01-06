import EventEmitter from "node:events";
import { TypedEmitter } from "./types";

export type LoopState = "running" | "paused" | "stopped";

export interface LoopEvents<T> {
    start: [];
    tick: [result: T];
    pause: [{ remaining: number }];
    resume: [];
    stop: [];
    error: [error: any];
}

const TypedEmitterBase = EventEmitter as { new <T>(): TypedEmitter<LoopEvents<T>> };

export class Loop<T = any> extends TypedEmitterBase<T> {
    private _state: LoopState = "stopped";
    private timeoutId: any = null;
    private delay: number;
    private fn: (loop: Loop<T>) => Promise<T> | T;

    private startTime: number = 0;
    private remaining: number = 0;

    private async run() {
        const currentState: LoopState = this._state;

        if (currentState === "stopped" || currentState === "paused") return;

        try {
            const result = await this.fn(this);
            this.emit("tick", result);
        } catch (err) {
            this.emit("error", err);
        }

        // Re-check state after the async function finishes
        if (this._state === "running") {
            this.startTime = Date.now();
            this.remaining = 0;
            this.clearTimer();
            this.timeoutId = setTimeout(() => this.run(), this.delay);
        }
    }

    private clearTimer() {
        if (this.timeoutId) {
            clearTimeout(this.timeoutId);
            this.timeoutId = null;
        }
    }

    /**
     * Creates an interval. If the function is async, it will wait for it to complete before scheduling the next run.
     * @param fn The function to run.
     * @param delay The delay between runs in milliseconds.
     * @param immediate Whether to start the loop immediately. [default: true]
     */
    constructor(fn: (loop: Loop<T>) => Promise<T> | T, delay: number, immediate = true) {
        super();
        this.fn = fn;
        this.delay = delay;
        if (immediate) this.start();
    }

    get state(): LoopState {
        return this._state;
    }

    /** Starts the loop. */
    start() {
        if (this._state !== "stopped") return;
        this._state = "running";
        this.emit("start");
        this.run();
    }

    /** Resumes a paused loop. */
    resume() {
        if (this._state !== "paused") return;
        this._state = "running";
        this.emit("resume");
        if (this.remaining <= 0) {
            this.run();
        } else {
            this.timeoutId = setTimeout(() => this.run(), this.remaining);
        }
    }

    /** Stops the loop. */
    stop() {
        const wasRunning = this._state !== "stopped";
        this._state = "stopped";
        this.remaining = 0;
        this.clearTimer();
        if (wasRunning) this.emit("stop");
    }

    /** Pauses the execution. */
    pause() {
        if (this._state !== "running") return;
        this._state = "paused";
        const elapsed = Date.now() - this.startTime;
        this.remaining = Math.max(0, this.delay - elapsed);
        this.emit("pause", { remaining: this.remaining });
        this.clearTimer();
    }

    /**
     * Sets the delay between runs
     * @param ms The new delay in milliseconds.
     */
    setDelay(ms: number) {
        this.delay = ms;
    }

    /** Manually trigger the function once without affecting the loop. */
    async execute() {
        await this.fn(this);
    }
}
