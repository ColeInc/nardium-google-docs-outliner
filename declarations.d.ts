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
}
