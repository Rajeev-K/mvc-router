namespace MvcRouter {
    /**
     * Your model objects and your custom controls can implement events to let other parts of the
     * application know that something has happened.
     */
    export class Event<T1, T2 extends EventArgs> {
        private listeners: Listener<T1, T2>[] = [];

        public trigger(sender: T1, eventArgs: T2): any {
            this.listeners.forEach(listener => listener.call(sender, sender, eventArgs));
        }

        public addListener(listener: Listener<T1, T2>) {
            if (!this.listeners.some(l => l === listener)) {
                this.listeners.push(listener);
            }
        }

        public removeListener(listener: Listener<T1, T2>) {
            const index = this.listeners.indexOf(listener);
            if (index !== -1) {
                this.listeners.splice(index, 1);
            }
        }
    }

    export type Listener<T1, T2> = (sender: T1, eventArgs: T2) => void;

    export class EventArgs {
        public static Empty = new EventArgs();
    }

    export class PropertyChangedEventArgs extends EventArgs {
        propertyName: string;
    }
}
