
declare interface GeneTooltipVis {
    or?:    Array<string>;
    and?:   Array<string>;
};

declare interface GeneTooltip {
    closeable: boolean;
    show: GeneTooltipVis;
    hide: GeneTooltipVis;
    html: string;
};
