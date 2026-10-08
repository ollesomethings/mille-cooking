// Deep Thoughts — API-facing types. Runtime categories/limits come from somethings-api.

export interface DeepThoughtsCategory {
  slug: string;
  label: string;
}

export interface DeepThoughtsDefinition {
  type: 'deep_thoughts';
  label: string;
  description: string;
  renderMode: 'native';
  featureFlag: 'activity_deep_thoughts';
  staticContent: {
    version: string;
    categories: {
      minSelected: number;
      maxSelected: number;
      allowCustom: boolean;
      customLabelMax: number;
      options: DeepThoughtsCategory[];
    };
    text: {
      maxLength: number;
    };
    voice: {
      minSeconds: number;
      maxSeconds: number;
      uploadPurpose: 'q3_voice';
    };
  };
}

export type DeepThoughtsQ3 =
  | {
      type: 'voice';
      audioS3Key: string;
      transcript: string | null;
    }
  | {
      type: 'text';
      text: string;
    }
  | {
      type: 'none';
    };

export interface DeepThoughtsResponses {
  q1: string[];
  q2: {
    heaviest: string;
    extraText?: string;
  };
  q3: DeepThoughtsQ3;
}

export interface DeepThoughtsResult {
  responses: DeepThoughtsResponses;
}

export interface DeepThoughtsAvailabilityPrereqs {
  hotTakesCompleted: number;
  connectMomentCompleted: number;
  allMet: boolean;
}
