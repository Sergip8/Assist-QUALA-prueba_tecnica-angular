export interface ApiRequest<T> {
   success: boolean;
   message: string;
   statusCode?: string
   type?: string
   timestamp: Date
   data: T;
}