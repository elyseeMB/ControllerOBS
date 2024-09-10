export type AssetName = string
export type AssetId = number

export type AssetSource = {
  name: AssetName,
  options: any
}

export type AssetContainer = {
  name: AssetName
  sources: AssetSource[]
  options: any
}

export type AssetScene = {
  name: AssetName
  containers: AssetContainer
}

export interface Connection {
  ip: string,
  password: string
}

export type Asset = {
  id: AssetId
  name: AssetName
  scene: AssetScene
  container: AssetContainer
  sources: AssetSource
}

export type ResponseObsScene = {
  sceneIndex: number
  sceneName: string
  sceneUuid: string
}

export type ResponseObsItem = {
  inputKind: null
  isGroup: boolean
  sceneItemBlendMode: string
  sceneItemEnabled: boolean
  sceneItemId: number
  sceneItemIndex: number
  sceneItemLocked: boolean
  sceneItemTransform: any
  sourceName: string
  sourceType: string
}

type MethodKeys<T> = {
  [K in keyof T]: T[K] extends (...args: any[]) => any ? K : never;
}[keyof T];

type MethodsOnly<T> = Pick<T, MethodKeys<T>>;

export type DynamicResponseObsItem<T extends MethodsOnly<T>, K extends keyof T> = ReturnType<T[K]>;

