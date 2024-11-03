import { App, Plugin, PluginManifest } from 'obsidian';
import type { Howl } from 'howler';

import { DEFAULT_MAP, keySoundMap } from './keySoundMap';
import { ClickClackSettings, DEFAULT_SETTINGS_V1 } from './settings';
import { ClickClackSettingTab } from './SettingTab';
import { defaultSounds } from './defaultSound';
import { SchemeHelper } from './schemeHelper';

export interface Sounds {
	key: Howl;
	key2: Howl;
	enter: Howl;
	space: Howl;
	delete: Howl;
}

export default class ClickClackPlugin extends Plugin {
	public settings: ClickClackSettings;
	public sounds: Sounds;
	public schemeHelper: SchemeHelper;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.sounds = defaultSounds;
		this.schemeHelper = new SchemeHelper(app);
	}

	async onload(): Promise<void> {
		await this.loadSettings();
		
		// Add settings tab
		this.addSettingTab(new ClickClackSettingTab(this.app, this));
		
		// Load sound scheme
		this.sounds = await this.schemeHelper.loadScheme(
			this.settings.activeScheme
		);
		
		// Register event listener on document level to capture all keyboard events, including canvas
		this.registerDomEvent(
			document,
			'keydown',
			(evt: KeyboardEvent) => {
				if (!this.settings.enabled) return;
				if (evt.ctrlKey) return;
				if (evt.metaKey) return;
				if (evt.altKey && !evt.ctrlKey && !evt.metaKey) return;
				
				const soundKey = DEFAULT_MAP[evt.code as keyof keySoundMap] as keyof Sounds;
				if (soundKey && this.sounds[soundKey]) {
					this.sounds[soundKey].play();
				}
			}
		);

		// Add commands
		this.addCommand({
			id: 'enable-click-clack-sound',
			name: 'Enable click clack sound',
			checkCallback: (checking: boolean) => {
				if (checking) return !this.settings.enabled;
				this.toggleSound(true);
				return true;
			},
		});

		this.addCommand({
			id: 'disable-click-clack-sound',
			name: 'Disable click clack sound',
			checkCallback: (checking: boolean) => {
				if (checking) return this.settings.enabled;
				this.toggleSound(false);
				return true;
			},
		});
	}

	async onunload(): Promise<void> {
		this.unloadSounds();
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS_V1,
			await this.loadData()
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	async toggleSound(targetState: boolean): Promise<void> {
		this.settings.enabled = targetState;
		await this.saveSettings();
	}

	async refreshSounds(): Promise<void> {
		this.sounds = await this.schemeHelper.loadScheme(
			this.settings.activeScheme
		);
	}

	stopSounds(): void {
		for (const key in this.sounds) {
			this.sounds[key as keyof Sounds].stop();
		}
	}

	unloadSounds(): void {
		for (const key in this.sounds) {
			this.sounds[key as keyof Sounds].unload();
		}
	}
}
