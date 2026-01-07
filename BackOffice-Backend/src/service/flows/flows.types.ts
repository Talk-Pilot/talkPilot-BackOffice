export type InteractionType = {
  id: string;
  type: string;
  name: string;
  text: string;
  position: { x: number; y: number };
  successStatus: string;
  children: string[];
};

export type CreateFlowResultType = {
  id: string;
  clientId: string;
  name: string;
  interactions: Array<InteractionType>;
};

export type FlowDocumentType = {
  clientId: string;
  flowName: string;
  interactions: Array<InteractionType>;
};
