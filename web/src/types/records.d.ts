
interface GeneDisplay {
    label_width:        number;
    width:              number;
    text_anchor:        "middle" | "end" | "start";
    start:              number;
    end:                number;
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
    // These are locus zoom elements
    display_range:      GeneDisplay;
}