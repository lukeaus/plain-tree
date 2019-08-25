import { Node } from './index';

export type NodeOrNull = Node | null;

export interface CreateOptions {
  idKey?: string;
  parentIdKey?: string;
}

export interface CreateOptionsWithCustomChildrenKey extends CreateOptions {
  childrenKey?: string;
}

export type SerializedNode = {
  data: any;
  children: SerializedNode[] | Node[];
  id: string;
  parentId: string | null;
};

export type ObjectAnyProperties = {
  [key: string]: any;
};
