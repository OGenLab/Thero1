import { ISocket } from "./NetInterface";

/**  */
export default class CWebSocket implements ISocket {
    private ws: WebSocket = null;

    /** 事件 */
    public onConnect: (event) => void = null;
    public onMessage: (msg: ArrayBuffer) => void = null;
    public onError: (event) => void = null;
    public onClose: (event) => void = null;

    /** 连接网络 */
    public connect(option: string | {ip: string, port: number, protocol: string}) {
        if(this.ws && this.ws.readyState === WebSocket.CONNECTING) {
            console.log("已经连接上网络, 重新连接前请先调用close方法!");
            return false;
        }
        let url = "";
        if(typeof(option) == "string") {
            url = option;
        }else {
            url = `${option.protocol}://${option.ip}:${option.port}`;
        }

        this.ws = new WebSocket(url);
        this.ws.binaryType = "arraybuffer";
        
        this.ws.onopen = this.onConnect;
        this.ws.onmessage = (event: MessageEvent) => {
            this.onMessage(event.data);
        };
        this.ws.onclose = this.onClose;
        this.ws.onerror = this.onError;
        return true;
    }

    /** 发送消息 */
    public send(data: ArrayBuffer) {
        if(!this.ws || this.ws.readyState !== WebSocket.OPEN) {
            console.log('网络连接已关闭, 无法发送消息');
            return false;
        }
        this.ws.send(data);
        return true;
    }

    /** 主动关闭连接 */
    public close() {
        if(this.ws && this.ws.readyState !== WebSocket.CLOSED) {
            this.ws.close();
            this.ws.onopen = null
            this.ws.onmessage = null
            this.ws.onclose = null
            this.ws.onerror = null
            this.ws = null;
        }
        return true;
    }
}