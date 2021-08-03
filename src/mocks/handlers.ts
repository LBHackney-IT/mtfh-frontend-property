import { rest } from 'msw';
import { mockProperty } from './data';
import { config } from '../services/config';

export const handlers = [
    rest.get(
        `${config.propertyApiUrl}/assets/:targetId`,
        (request, response, context) => {
            return response(context.status(200), context.json(mockProperty));
        }
    ),
];
