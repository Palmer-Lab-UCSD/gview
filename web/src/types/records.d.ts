
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
	Refseq:             string;
	Feature:            string;
	start:              number; 
	end:                number; 
	strand:             string;
	GeneId:             string;
	TranscriptId:       string;
	Product:            string;
	GeneBiotype:        string;
	TranscriptBiotype:  string;
    // These elements are added by locuszoom, they are not returned
    // from data base
    display_range:      GeneDisplay;
    display_domain:     GeneDisplay;
    track:              number | null;
    parent:             any;
}