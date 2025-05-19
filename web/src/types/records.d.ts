
interface GeneDisplay {
    start:              number;
    end:                number;
    label_width?:        number;
    width?:              number;
    text_anchor?:        "middle" | "end" | "start";
}

declare interface GeneAnnotationRecord {
    // elements expected from data base query
	id:                 number;
	chr:                string;
	refseq:             string;
	feature:            string;
	start:              number; 
	end:                number; 
	strand:             string;
	geneId:             string;
	transcriptId:       string;
	product:            string;
	geneBiotype:        string;
	transcriptBiotype:  string;
}



declare interface GeneTrackRecord extends GeneAnnotationRecord {
    display_range:      GeneDisplay;
    display_domain:     GeneDisplay;
    track:              number | null;
    parent:             any;
}