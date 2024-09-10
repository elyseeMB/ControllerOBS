import type { Socket } from "socket.io-client";

type PropsEvent = {
  socket: Socket;
  event: string;
  data?: any
}

export async function socketEmitter({socket, event, data}: PropsEvent) {
  return await new Promise((resolve, reject) => {
    if (!socket) {
      return reject("Socket not connected");
    }
    socket.emit(event, data, (response: any) => {
      if (response && response.error) {
        reject(response.error);
      } else {
        resolve(response);
      }
    });
  });
}