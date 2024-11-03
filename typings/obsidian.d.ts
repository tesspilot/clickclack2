declare module "obsidian" {
    export class Plugin {
        app: App;
        manifest: PluginManifest;
        
        constructor(app: App, manifest: PluginManifest);
        
        addSettingTab(settingTab: PluginSettingTab): void;
        registerDomEvent(el: Element | Document | Window, type: string, callback: (evt: any) => any): void;
        addCommand(command: {
            id: string;
            name: string;
            checkCallback?: (checking: boolean) => boolean | void;
            callback?: () => any;
            hotkeys?: any[];
        }): void;
        loadData(): Promise<any>;
        saveData(data: any): Promise<void>;
        onload(): Promise<void>;
        onunload(): Promise<void>;
    }

    export class App {
        vault: Vault;
        plugins: {
            getPlugin(name: string): Plugin | null;
            plugins: {
                [id: string]: Plugin;
            };
        };
    }

    export class Vault {
        adapter: DataAdapter;
        configDir: string;
    }

    export interface DataAdapter {
        exists(normalizedPath: string): Promise<boolean>;
        read(normalizedPath: string): Promise<string>;
        readBinary(normalizedPath: string): Promise<ArrayBuffer>;
        write(normalizedPath: string, data: string): Promise<void>;
        writeBinary(normalizedPath: string, data: ArrayBuffer): Promise<void>;
        mkdir(normalizedPath: string): Promise<void>;
        list(normalizedPath: string): Promise<ListedFiles>;
    }

    export interface ListedFiles {
        files: string[];
        folders: string[];
    }

    export class PluginSettingTab {
        app: App;
        containerEl: HTMLElement;
        plugin: Plugin;

        constructor(app: App, plugin: Plugin);
        display(): void;
        hide(): void;
    }

    export class Setting {
        controlEl: HTMLElement;
        
        constructor(containerEl: HTMLElement);
        setName(name: string): this;
        setDesc(desc: string): this;
        setHeading(): this;
        addToggle(cb: (toggle: ToggleComponent) => any): this;
        addSlider(cb: (slider: SliderComponent) => any): this;
        addDropdown(cb: (dropdown: DropdownComponent) => any): this;
        addButton(cb: (button: ButtonComponent) => any): this;
        addExtraButton(cb: (button: ExtraButtonComponent) => any): this;
    }

    export class ToggleComponent {
        setValue(value: boolean): this;
        getValue(): boolean;
        onChange(callback: (value: boolean) => any): this;
    }

    export class SliderComponent {
        setValue(value: number): this;
        getValue(): number;
        setLimits(min: number, max: number, step: number): this;
        setDynamicTooltip(): this;
        onChange(callback: (value: number) => any): this;
    }

    export class DropdownComponent {
        selectEl: HTMLSelectElement;
        
        constructor();
        addOption(value: string, display: string): this;
        addOptions(options: Record<string, string>): this;
        getValue(): string;
        setValue(value: string): this;
        onChange(callback: (value: string) => any): this;
    }

    export class ButtonComponent {
        setButtonText(name: string): this;
        setCta(): this;
        setIcon(icon: string): this;
        onClick(callback: () => any): this;
    }

    export class ExtraButtonComponent extends ButtonComponent {
        setIcon(icon: string): this;
        setTooltip(tooltip: string): this;
    }

    export interface PluginManifest {
        id: string;
        name: string;
        version: string;
        minAppVersion: string;
        description: string;
        author: string;
        authorUrl?: string;
        isDesktopOnly?: boolean;
    }

    export interface RequestUrlResponse {
        arrayBuffer: Promise<ArrayBuffer>;
        json: Promise<any>;
    }

    export function normalizePath(path: string): string;
    export function requestUrl(request: string | {
        url: string;
        method?: string;
        headers?: Record<string, string>;
        body?: string | ArrayBuffer;
    }): Promise<RequestUrlResponse>;
    export class Notice {
        constructor(message: string, timeout?: number);
    }
    export const moment: any;
}

declare module "howler" {
    export interface Howl {
        play(): number;
        stop(): this;
        unload(): void;
        volume(value: number): this | number;
    }
}
