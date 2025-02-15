import { Dispatch, SetStateAction } from "react";
import { FlowType, TweaksType } from "../flow";

export type TabsContextType = {
  saveFlow: (flow: FlowType) => Promise<void>;
  save: () => void;
  tabId: string;
  setTabId: (index: string) => void;
  flows: Array<FlowType>;
  setFlows: (f) => void;
  removeFlow: (id: string) => void;
  addFlow: (flowData?: FlowType, newProject?: boolean) => Promise<String>;
  updateFlow: (newFlow: FlowType) => void;
  incrementNodeId: () => string;
  downloadFlow: (
    flow: FlowType,
    flowName: string,
    flowDescription?: string
  ) => void;
  downloadFlows: () => void;
  uploadFlows: () => void;
  uploadFlow: (newFlow?: boolean, file?: File) => void;
  hardReset: () => void;
  //disable CopyPaste
  disableCopyPaste: boolean;
  setDisableCopyPaste: (value: boolean) => void;
  getNodeId: (nodeType: string) => string;
  tabsState: TabsState;
  setTabsState: Dispatch<SetStateAction<TabsState>>;
  paste: (
    selection: { nodes: any; edges: any },
    position: { x: number; y: number; paneX?: number; paneY?: number }
  ) => void;
  lastCopiedSelection: { nodes: any; edges: any };
  setLastCopiedSelection: (selection: { nodes: any; edges: any }) => void;
  setTweak: (tweak: TweaksType) => void;
  getTweak: TweaksType[];
  turnPage: (page: number) => any;
  search: (v: string) => any,
};

export type TabsState = {
  [key: string]: {
    isPending: boolean;
    formKeysData: {
      template?: string;
      input_keys?: Object[];
      memory_keys?: Array<string>;
      handle_keys?: Array<string>;
    };
  };
};
