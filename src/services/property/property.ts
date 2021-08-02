import { AxiosSWRResponse, useAxiosSWR } from '@mtfh/common';
import { Property } from './property.types';
import { config } from '../config';

export function useProperty(targetId: string): AxiosSWRResponse<Property> {
    return useAxiosSWR(`${config.propertyApiUrl}/assets/${targetId}`);
}

export function usePropertyMock(targetId: string): AxiosSWRResponse<Property> {
    return useAxiosSWR(`${config.mockPropertyApiUrl}/assets/${targetId}`);
}
