

declare interface ChrState {
    projectId:      string;
    phenotype:      string;
    chr:            string;
    build?:         string;
}

declare interface AssocState extends ChrState {
    start:          string;
    end:            string;
}


declare interface AxisSettings {
   field:           string;
   axis?:           number;
   floor?:          number;
   upper_buffer?:   number;
   min_extent?:     Array<number>;
}