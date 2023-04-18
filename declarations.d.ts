declare namespace chrome {
    declare namespace runtime {
        interface InstalledDetails {
            reason: chrome.runtime.OnInstalledReason;
            previousVersion?: string;
            id: string;
            temporary: boolean;
            name?: string;
            manifest: any;
        }

        type OnInstalledReason = "install" | "update" | "chrome_update" | "shared_module_update";

        /**
         * Fired when the extension is first installed, when the extension is updated to a new version,
         * and when Chrome is updated to a new version.
         */
        export namespace onInstalled {
            /**
             * Adds a listener to this event.
             * @param callback The callback function to be invoked when the event is fired.
             */
            function addListener(callback: (details: InstalledDetails) => void): void;
        }
    }

    declare namespace identity {
        function getAuthToken(details: chrome.identity.TokenDetails, callback: (token: string) => void): void;

        interface TokenDetails {
            interactive?: boolean;
            accountHint?: string;
            scopes?: string[];
        }
    }

    declare namespace runtime {
        /**
         * The last error that occurred in this extension or app. If no error has occurred since the last time the extension or app was run, this property will be `undefined`.
         * @see {@link https://developer.chrome.com/docs/extensions/reference/runtime/#property-lastError}
         */
        export const lastError: chrome.runtime.LastError | undefined;

        /**
         * An object representing the last error that occurred in the extension or app.
         * @see {@link https://developer.chrome.com/docs/extensions/reference/runtime/#type-LastError}
         */
        export interface LastError {
            /**
             * The message associated with the error, if any.
             */
            message?: string;

            /**
             * The stack trace associated with the error, if any.
             */
            stack?: string;
        }

        interface MessageSender {
            tab?: Tab;
            id?: string;
            url?: string;
            tlsChannelId?: string;
            frameId?: number;
        }

        function sendMessage(
            extensionId: string,
            message: any,
            options?: object,
            responseCallback?: (response: any) => void
        ): void;

        function sendMessage(message: any, options?: object, responseCallback?: (response: any) => void): void;

        function connect(extensionId?: string, connectInfo?: object): Port;

        function connectNative(application: string): Port;

        function getManifest(): object;

        function getURL(path: string): string;

        function reload(): void;

        function requestUpdateCheck(callback: (status: string, details: object) => void): void;

        function restart(): void;

        function setUninstallURL(url: string): void;

        function getBackgroundPage(callback: (backgroundPage: Window | null) => void): void;

        function openOptionsPage(callback?: () => void): void;

        const lastError: LastError;

        const onMessage: {
            addListener(
                callback: (message: any, sender: MessageSender, sendResponse: (response: any) => void) => void,
                filter?: object
            ): void;
            removeListener(
                callback: (message: any, sender: MessageSender, sendResponse: (response: any) => void) => void
            ): void;
        };
    }
}
