import ClickClackPlugin, { Sounds } from './main';
import { PluginSettingTab, Setting, App } from 'obsidian';
import { defaultScheme } from './defaultSound';
import { i18n } from './libs/i18n';
import { FetchHelper } from './fetchHelper';

export class ClickClackSettingTab extends PluginSettingTab {
	plugin: ClickClackPlugin;
	fetchHelper: FetchHelper;

	constructor(app: App, plugin: ClickClackPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.fetchHelper = new FetchHelper(app);
	}

	async display(): Promise<void> {
		const { containerEl } = this;

		containerEl.empty();

		new Setting(containerEl)
			.setName(i18n.t('settings.toggle-sound.name'))
			.addToggle((toggle) => {
				toggle
					.setValue(this.plugin.settings.enabled)
					.onChange(async (value) => {
						this.plugin.settings.enabled = value;
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(i18n.t('settings.volume.name'))
			.setDesc(i18n.t('settings.volume.desc'))
			.addSlider((slider) => {
				slider
					.setLimits(0.0, 100, 1.0)
					.setValue(this.plugin.settings.volumn ?? 100)
					.setDynamicTooltip()
					.onChange(async (value) => {
						this.plugin.settings.volumn = value;
						Object.keys(this.plugin.sounds).forEach((k) =>
							this.plugin.sounds[k as keyof Sounds].volume(
								value / 100
							)
						);
						await this.plugin.saveSettings();
					});
			});

		new Setting(containerEl)
			.setName(i18n.t('settings.resource'))
			.setHeading();

		let dropdown: any;
		const schemeSetting = new Setting(containerEl)
			.setName(i18n.t('settings.scheme.name'))
			.addDropdown(async (comp) => {
				dropdown = comp;
				comp.addOptions({
					default: i18n.t('settings.scheme.default'),
					...await this.plugin.schemeHelper.getInstalledSchemes()
				})
				.setValue(this.plugin.settings.activeScheme.id)
				.onChange(async (value) => {
					const scheme =
						(await this.plugin.schemeHelper.getScheme(value)) ??
						defaultScheme;
					this.plugin.settings.activeScheme = scheme;
					this.plugin.sounds = await this.plugin.schemeHelper.loadScheme(
						scheme
					);
					await this.plugin.saveSettings();
				});
			})
			.addExtraButton((button) => {
				button.setIcon('refresh-cw').onClick(async () => {
					dropdown.addOptions({
						default: i18n.t('settings.scheme.default'),
						...await this.plugin.schemeHelper.getInstalledSchemes()
					});
					dropdown.setValue(this.plugin.settings.activeScheme.id);
				});
			});

		new Setting(containerEl)
			.setName(i18n.t('settings.download.name'))
			.setDesc(i18n.t('settings.download.desc'))
			.addButton((button) =>
				button
					.setCta()
					.setButtonText(i18n.t('settings.download.button'))
					.setIcon('download')
					.onClick(async () => {
						await this.fetchHelper.checkOrDownload();
					})
			);
	}
}
