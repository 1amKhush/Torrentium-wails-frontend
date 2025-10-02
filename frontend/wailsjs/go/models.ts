export namespace main {
	
	export class LocalFileFE {
	    cid: string;
	    filename: string;
	    fileSize: number;
	    filePath: string;
	    fileHash: string;
	    createdAt: string;
	
	    static createFrom(source: any = {}) {
	        return new LocalFileFE(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.cid = source["cid"];
	        this.filename = source["filename"];
	        this.fileSize = source["fileSize"];
	        this.filePath = source["filePath"];
	        this.fileHash = source["fileHash"];
	        this.createdAt = source["createdAt"];
	    }
	}

}

