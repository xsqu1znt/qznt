export type AnyFunc = (...args: any) => any;

export type DeepPartial<T> = {
    [P in keyof T]?: T[P] extends object ? DeepPartial<T[P]> : T[P];
};

export type TypedEmitter<TEvents extends Record<string, any>> = {
    on<K extends keyof TEvents>(event: K, listener: (...args: TEvents[K]) => void): any;
    once<K extends keyof TEvents>(event: K, listener: (...args: TEvents[K]) => void): any;
    off<K extends keyof TEvents>(event: K, listener: (...args: TEvents[K]) => void): any;
    emit<K extends keyof TEvents>(event: K, ...args: TEvents[K]): boolean;
};
