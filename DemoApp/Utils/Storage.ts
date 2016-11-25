/** Save value in local storage. */
export function store(key: string, value: string): void {
    try {
        if (window.localStorage) {
            window.localStorage.setItem(key, value);
        }
    }
    catch (ex) {
    }
}

/** Load value from local storage. */
export function load(key: string): string {
    try {
        if (window.localStorage) {
            return window.localStorage.getItem(key);
        }
    }
    catch (ex) {
    }
    return null;
}

/** Remove token from storage. */
export function remove(key: string): void {
    try {
        if (window.localStorage) {
            window.localStorage.removeItem(key);
        }
    }
    catch (ex) {
    }
    return null;
}
