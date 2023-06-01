declare namespace chrome {
    declare namespace identity {
        function getAuthToken(details: chrome.identity.TokenDetails, callback: (token: string) => void): void;

        interface TokenDetails {
            interactive?: boolean;
            accountHint?: string;
            scopes?: string[];
        }

        function removeCachedAuthToken(details: { token: string }): Promise<void>;

        interface ProfileUserInfo {
            id: string;
            email?: string;
        }

        function getProfileUserInfo(callback: (userInfo: ProfileUserInfo) => void): void;
    }

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

    declare namespace tabs {
        /**
         * Retrieves all tabs that match the specified query.
         *
         * @param query - An object containing properties used to filter the set of tabs returned.
         * @param callback - A function to be called with the result of the query. The callback parameter should be a function that takes an array of Tab objects as its sole argument.
         */
        function query(query: QueryInfo, callback: (tabs: Tab[]) => void): void;

        /**
         * Information about the query to be made for tabs.
         */
        interface QueryInfo {
            /**
             * Whether the tabs are active in their windows.
             */
            active?: boolean;

            /**
             * Whether the tab is the last focused window.
             */
            lastFocusedWindow?: boolean;

            /**
             * Whether the tabs are audible.
             */
            audible?: boolean;

            /**
             * Whether the tabs are highlighted.
             */
            highlighted?: boolean;

            /**
             * Whether the tabs are in the current window.
             */
            currentWindow?: boolean;

            /**
             * The ID of the window the tabs are in.
             */
            windowId?: number;

            /**
             * The index of the tab within its window.
             */
            index?: number;

            /**
             * The URL of the tab.
             */
            url?: string;

            /**
             * The title of the tab.
             */
            title?: string;

            /**
             * Whether the tab is pinned.
             */
            pinned?: boolean;

            /**
             * Whether the tab is discarded.
             */
            discarded?: boolean;

            /**
             * Whether the tab is in an incognito window.
             */
            incognito?: boolean;

            /**
             * Whether the tab is muted.
             */
            muted?: boolean;
        }

        /**
         * Information about a tab.
         */
        interface Tab {
            /**
             * The ID of the tab.
             */
            id: number;

            /**
             * The ID of the window the tab is in.
             */
            windowId: number;

            /**
             * The index of the tab within its window.
             */
            index: number;

            /**
             * The URL of the tab.
             */
            url: string;

            /**
             * The title of the tab.
             */
            title: string;

            /**
             * Whether the tab is active in its window.
             */
            active: boolean;

            /**
             * Whether the tab is pinned.
             */
            pinned: boolean;

            /**
             * Whether the tab is highlighted.
             */
            highlighted: boolean;

            /**
             * Whether the tab is muted.
             */
            mutedInfo: MutedInfo;

            /**
             * Whether the tab is discarded.
             */
            discarded: boolean;

            /**
             * Whether the tab is in an incognito window.
             */
            incognito: boolean;
        }

        /**
         * Information about a muted tab.
         */
        interface MutedInfo {
            /**
             * Whether the tab is currently muted.
             */
            muted: boolean;

            /**
             * The reason that the tab is muted.
             */
            reason?: string;

            /**
             * The extension ID of the extension that muted the tab (if any).
             */
            extensionId?: string;
        }

        function executeScript(
            details: {
                code?: string;
                file?: string;
                allFrames?: boolean;
                frameId?: number;
                matchAboutBlank?: boolean;
                runAt?: "document_start" | "document_end" | "document_idle";
            },
            callback?: (result: any[]) => void
        ): void;
    }
}
