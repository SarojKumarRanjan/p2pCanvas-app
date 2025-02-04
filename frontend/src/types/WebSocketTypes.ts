export type WebSocketMessage = 
  | ConnectMessage
  | CreateRoomMessage
  | JoinRoomMessage
  | ErrorMessage
  | any ;

export interface ConnectMessage {
  method: 'connect';
  id: string;
}

export interface CreateRoomMessage {
  method: 'create';
  id: string;
  
}

export interface JoinRoomMessage {
  method: 'join';
  id: string;
  room_id: string;
}

export interface ErrorMessage {
  error: string;
  message: string;
}
