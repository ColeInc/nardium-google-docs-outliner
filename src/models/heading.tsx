export interface Heading {
    headingId: string;
    headingDigit?: number;
    headingText?: string;
    startIndex?: string;
    endIndex?: string;
    children?: Heading[];
}
