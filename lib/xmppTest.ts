import {XmppTest} from "./interfaces";
import {Config} from "./config";

//----------------------------------------------------------------------------------------------------------------------
/**
 * XMPP Test
 * singleton class
 */
export class xmppTest implements XmppTest.IXmppTest{
    
    private static instance: xmppTest;
    public config      : Config;
    
    constructor(public applog : any , public appRoot : string) {
        if (xmppTest.instance) {
            return xmppTest.instance;
        }
        // load Config
        this.config = new Config(applog,appRoot);
        
        xmppTest.instance = this;
    }
    public run() {
        this.Debug('Start');
        let XMPP = require('stanza.io');
    
        let client = XMPP.createClient({
            jid: 'peerinfo@vpn.restomax.com',
            password: '150320',
            resource: 'test',
            transport: 'websocket',
            server: 'vpn.restomax.com',
            wsURL: 'ws://vpn.restomax.com:7070/ws/',
            sasl: ['digest-md5', 'plain']
            });
    
        client.on('connected', function (e,err) {
            console.log('connected');
            console.log(err);
            console.log('connected');
        });
    
        client.on('disconnected', function (e,err) {
            console.log('disconnected');
            console.log(err);
        });
    
        client.on('auth:failed', function () {
            console.log('auth:failed');
        });
    
        client.on('auth:success', function () {
            console.log('auth:success');
        });
    
        client.on('raw:incoming', function (xml) {
            //console.log('raw:incoming');
            //console.log(xml);
        });
    
        client.on('raw:outgoing', function (xml) {
            //console.log('raw:outgoing');
            //console.log(xml);
        });
    
        client.on('session:started', function () {
            console.log('session:started');
            client.getRoster();
            client.sendPresence();
            console.log('>>>>>>>>>>>>>>>>>>>');
            console.log('Send CJL Message');
            client.sendMessage({
                to: 'mediator@vpn.restomax.com/MediatorSvc_RMX_RX10_1.5.17.2.15',
                body: "<mediator><CJL><peerinfo@vpn.restomax.com/test><CMAXNum:006.1234561.PC71><q:xxx>",
            });
            // Update the value for the progress-bar on an interval.
            setInterval(() => {
                let applog  = require('debug')('xmpp');
                applog('message out');
                //applog('Send HELO  Message');
                client.sendMessage({
                    to: 'mediator@vpn.restomax.com/MediatorSvc_RMX_RX10_1.5.17.2.15',
                    body: "<mediator><HELO><peerinfo@vpn.restomax.com/test><CMAXNum:006.1234561.PC71><q:xxx>",
                });
            }, 7000);
        });
    
        client.on('chat', function (msg) {
            //console.log('chat');
            //client.sendMessage({
            //    to: msg.from,
            //    body: 'You sent: ' + msg.body
            //});
        });
    
        client.on('message', (message) => {
            let applog  = require('debug')('xmpp');
            applog('message in');
            //applog('from:'+message.from+' to:'+message.to);
            //applog('body:'+message.body);
            //applog('message out');
            //console.log('>>>>>>>>>>>>>>>>>>>');
            //client.sendMessage({
            //    to: 'mediator@vpn.restomax.com/MediatorSvc_RMX_RX10_1.5.17.2.15',
            //    body: "<mediator><HELO><peerinfo@vpn.restomax.com/test><CMAXNum:006.1234561.PC71><q:xxx>",
            //});
        })
        console.log('connect');
        try {
            client.connect();
            console.log('running');
            }
        catch(err) {
            console.log(err);
            }
    }
    //..................................................................................................................
    //region Utility Function Debug/Error
    /**
     * show debug message
     * @param msg
     */
    private Debug(msg:string) : void {
        if (this.applog)
            this.applog(msg);
    }
    /**
     * show error message
     * @param msg
     */
    private Error(msg:string) : void {
        if (this.applog)
            this.applog(msg);
        else
            console.log(msg);
    }
    //endregion
    
}
