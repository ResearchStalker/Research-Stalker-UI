/**
 * Check ES6 Sets for equality.
 * @param setA - First set to compare
 * @param setB - Second set to compare
 * @returns `true` if the sets are equal, otherwise `false`
 */
export default function setsEqual<T>(setA: Set<T>, setB: Set<T>): boolean {
    if (setA.size !== setB.size) {
        return false;
    }

    for (const item of setA) {
        if (!setB.has(item)) {
            return false;
        }
    }

    return true;
}
