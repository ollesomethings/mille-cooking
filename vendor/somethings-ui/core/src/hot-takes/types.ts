export type HotTakeAnswer = 'agree' | 'disagree';

export interface HotTakeBankStatement {
  id: string;
  text: string;
  approved: boolean;
}

export interface HotTakesConfigStatement {
  id: string;
  text: string;
  mentorAnswer: HotTakeAnswer;
}

export interface HotTakesConfig {
  statements: HotTakesConfigStatement[];
}

export interface HotTakesResponse {
  statementId: string;
  teenAnswer: HotTakeAnswer;
}

export interface HotTakesResult {
  responses: HotTakesResponse[];
  matchesCount: number;
}

export interface HotTakesDefinition {
  type: 'hot_takes';
  staticContent: {
    version: string;
    statements: {
      minCount: number;
      maxCount: number;
      minTextLength: number;
      maxTextLength: number;
      bank: HotTakeBankStatement[];
    };
    answers: readonly HotTakeAnswer[];
  };
}
