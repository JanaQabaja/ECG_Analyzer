import joi from 'joi';

import { generalFields } from '../../middleware/validation.js';

export const insert_Image = joi.object({
file:generalFields.file.required
})