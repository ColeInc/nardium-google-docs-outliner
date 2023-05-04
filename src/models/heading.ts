export interface IHeading {
    headingId: string;
    headingDigit?: number;
    headingText?: string;
    startIndex?: number;
    endIndex?: number;
    children?: IHeading[];
}
