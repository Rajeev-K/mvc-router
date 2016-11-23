namespace MvcRouter.Utils {
    export function extend(dest: any, ...src: any[]): any {
        for (const obj of src) {
            if (obj) {
                for (const field in obj) {
                    if (obj.hasOwnProperty(field)) {
                        dest[field] = obj[field];
                    }
                }
            }
        }
        return dest;
    }
}
