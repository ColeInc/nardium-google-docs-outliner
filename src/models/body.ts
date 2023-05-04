export interface UnfilteredBody {
    body: { content: BodyContent[] };
}

export interface BodyContent {
    startIndex?: number;
    endIndex?: number;
    sectionBreak?: {
        sectionStyle?: {
            columnSeparatorStyle?: string;
            contentDirection?: string;
            sectionType?: string;
        };
    };
    paragraph?: {
        elements: {
            startIndex?: number;
            endIndex?: number;
            textRun?: {
                content?: string;
                textStyle?: {
                    underline?: boolean;
                    foregroundColor?: {
                        color: {
                            rgbColor?: {
                                red: number;
                                green: number;
                                blue: number;
                            };
                        };
                    };
                    link?: {
                        url: string;
                    };
                };
            };
        }[];
        paragraphStyle?: {
            headingId?: string;
            namedStyleType?: string;
            direction?: string;
        };
    };
}
