import { handleApiRequest, Env } from '../_shared/api';

export const onRequest: PagesFunction<Env> = async (context) => {
  return handleApiRequest(context.request, context.env);
};
