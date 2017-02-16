import {XmppTest} from "./interfaces";

//----------------------------------------------------------------------------------------------------------------------
/**
 * configuration class. Config is loaded from argv and/or configFile
 * singleton class
 */
export class Config implements XmppTest.IConfig {
    
    private static instance: Config;
    private static readonly _savedKeys_ : string[] = ["jabberUri"];
    
    public jabberUri   : string    = "vpn.restomax.com:80";
    public version     : string    = '0.0.0';
    
    constructor(public applog: any, public appRoot: string) {
        
        if (Config.instance) {
            return Config.instance;
            }
    
        let path  = require('path');
        let argv        : any    = Config.yargs();
        let configFile  : string = argv.configFile || path.join(appRoot,"/config.json");
        this.jabberUri  = argv.server;
        
        // load version
        let pjson = require('../package.json');
        this.version =  pjson.version || this.version;
    
        // first load default from file
        this.Debug('Version '+this.version);
        this.Debug('Load configFile '+configFile);
        try {
            let fs = require('fs');
            if (fs.existsSync(configFile)) {
                let obj = JSON.parse(fs.readFileSync(configFile, 'utf8'));
                this.assign(obj,Config._savedKeys_);
                this.Debug('.. loaded !');
            } else {
                this.Debug('** ' + configFile + ' NOT Found !');
            }   }
        catch (ex) {
            this.Error(ex.message);
        }
        
        this.Debug('Starting...');
        Config.instance = this;
    }
    
    //..................................................................................................................
    /**
     * Parse argv params using yargs module
     * @returns {"argv"}
     */
    public static yargs(): any {
        let yargv = require('yargs');
        let argv  = yargv
            .usage('Xmpp Test\nUsage: $0 [options] <command>')
            .example('xmppTest [options] blabla')
            .option("s", {
                "alias"   : 'server',
                "describe": 'Jabber Server Uri',
                "global"  : true
            })
            .option("h", {
                "alias"   : 'help',
                "describe": 'Show this screen',
                "type"    : 'boolean',
                "global"  : true
            })
            .exitProcess(false)
            .epilog('copyright 2017')
            .argv;
        
        // exit after version
        if (argv.version) {
            process.exit(0)
            }
        
        // always show help !
        yargv.showHelp("log");
        
        return argv;
        }
    
    //..................................................................................................................
    /**
     * simple copy only one level
     * @param src source object to be copied into this
     * @param whitelist of attribute to be copoed. If not set will copy all
     * @returns {Config}
     */
    private assign(src : any, whitelist? : string[]) : Config {
        // check if source is a object
        if (typeof (src) != 'object')
            return null;
        
        // assign only key in whitelist
        if (whitelist) {
            whitelist.forEach((key) => {
                let po = Object.getOwnPropertyDescriptor(src, key);
                let pt = Object.getOwnPropertyDescriptor(this, key);
                if ((pt) && (pt.writable)) {
                    if ((po) && (typeof (po.value) === typeof (pt.value)))
                        this[key]=po.value;
                }   });
            return this;
        }
        
        // assign all
        Object.keys(src).forEach((key)=>{
            let po  = Object.getOwnPropertyDescriptor(src , key);
            let pt  = Object.getOwnPropertyDescriptor(this, key);
            if ((po)&&(po.writable)){
                if ((po)&&(typeof (po.value)===typeof (pt.value)))
                    this[key]=po.value;
            }   });
        return this;
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
