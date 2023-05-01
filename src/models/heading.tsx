export interface IHeading {
    headingId: string;
    headingDigit?: number;
    headingText?: string;
    startIndex?: string;
    endIndex?: string;
    children?: IHeading[];
}
