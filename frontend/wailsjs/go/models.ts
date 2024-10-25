export namespace main {
	
	export class CreateClipRequest {
	    videoId: string;
	    start: string;
	    end: string;
	
	    static createFrom(source: any = {}) {
	        return new CreateClipRequest(source);
	    }
	
	    constructor(source: any = {}) {
	        if ('string' === typeof source) source = JSON.parse(source);
	        this.videoId = source["videoId"];
	        this.start = source["start"];
	        this.end = source["end"];
	    }
	}

}

