import {ChangeList} from './changeList.model';

export interface SdkPublishedManifest {
  defaultLocale: string;
  subscriptionKeys: string[];
  commitId: string;
  commit: ChangeList;
}

