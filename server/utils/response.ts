import type { H3Event } from "h3";

export const sendSuccess = <T>(event: H3Event, data: T, statusCode = 200) => {
  setResponseStatus(event, statusCode);
  return {
    success: true,
    data,
  };
};

export const sendError = (
  event: H3Event,
  message: string,
  statusCode = 400,
) => {
  setResponseStatus(event, statusCode);
  return {
    success: false,
    error: message,
  };
};
