export type UUID = string;

export type CreatePollInput = {
  question: string;
  options: string[];
};

export type UpdatePollInput = {
  pollId: UUID;
  question: string;
  options: string[];
};

export type DeletePollInput = {
  pollId: UUID;
};

export type StandardActionResult<T = unknown> = {
  ok: true;
  data: T;
} | {
  ok: false;
  error: {
    code: string;
    message: string;
    cause?: unknown;
  };
};


