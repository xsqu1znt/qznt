export type ToRecordContext<T, V> = {
    index: number;
    lastValue: V | undefined;
    newRecord: Readonly<Record<string | number, V>>;
    originalArray: ReadonlyArray<T>;
};

/**
 * Transforms an array into a object record with access to the object as it's being built.
 * @param array Array to process.
 * @param callback Function to map over the array.
 */
function record<T, V>(
    array: ReadonlyArray<T>,
    callback: (item: T, context: ToRecordContext<T, V>) => { key: string | number; value: V }
): Record<string | number, V> {
    const result: Record<string | number, V> = {};
    let lastValue: V | undefined = undefined;

    for (let i = 0; i < array.length; i++) {
        const { key, value } = callback(array[i]!, {
            index: i,
            lastValue,
            // NOTE: This is a reference to the object currently being built
            newRecord: result,
            originalArray: array
        });

        result[key] = value;
        lastValue = value;
    }

    return result;
}

export { record };
