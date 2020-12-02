// Vendor
import Service, {inject as service} from '@ember/service';
import {tracked} from '@glimmer/tracking';

// Types
import Storage from 'better-trading/services/storage';
import Blacklist from 'better-trading/services/the-forbidden-trove/blacklist';
import {TheForbbidenTroveBlacklistEntry, TheForbbidenTroveReport} from 'better-trading/types/the-forbidden-trove';

export default class TheForbiddenTrove extends Service {
  @service('the-forbidden-trove/blacklist')
  blacklist: Blacklist;

  @service('storage')
  storage: Storage;

  @tracked
  warnedBlacklistEntry: TheForbbidenTroveBlacklistEntry | null = null;

  @tracked
  pendingReport: TheForbbidenTroveReport | null = null;

  async fetchBlacklist(): Promise<TheForbbidenTroveBlacklistEntry[]> {
    return this.blacklist.fetch();
  }

  promptBlacklistEntryWarning(blacklistEntry: TheForbbidenTroveBlacklistEntry) {
    this.warnedBlacklistEntry = blacklistEntry;
  }

  clearBlacklistEntryWarning() {
    this.warnedBlacklistEntry = null;
  }

  report(accountName: string, characterName: string, tradeUrl: string) {
    const reportMessage = `
In game name: ${characterName}
Account name: ${accountName}
Trade link: <${tradeUrl}>
Transcript of the event: 
Proofs: 

> Pre-generated by the ExileCenter BetterTrade extension
    `.trim();

    this.pendingReport = {
      accountName,
      tradeUrl,
      reportMessage,
    };
  }

  clearPendingReport() {
    this.pendingReport = null;
  }
}

declare module '@ember/service' {
  interface Registry {
    'the-forbidden-trove': TheForbiddenTrove;
  }
}
