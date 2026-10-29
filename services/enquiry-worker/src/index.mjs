import { createHandler } from './handler.mjs';
import { sendEnquiry } from './smtp.mjs';

export default { fetch: createHandler(sendEnquiry) };
