import { UnfilteredBody } from "../models/body";

export const filterDocumentContent = (unfilteredContent: UnfilteredBody) => {
    const filteredHeadings = unfilteredContent?.body?.content?.filter(bodyItem => {
        const para = bodyItem.paragraph;
        if (!para) return false;

        // return anything that starts with "HEADING_"
        const headingType = para.paragraphStyle?.namedStyleType;
        return headingType?.startsWith("HEADING_");
    });
    return filteredHeadings;
};
