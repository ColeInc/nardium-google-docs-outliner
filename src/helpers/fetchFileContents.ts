import React from "react";
import { DocumentInfo, IDocumentContext } from "../models";
import { UnfilteredBody } from "../models/body";

// Get access token of logged in user, then use it to call google docs API to fetch document info
export const fetchFileContents = async (
    documentId: string | null,
    documentCtx: IDocumentContext
): Promise<UnfilteredBody | undefined> => {
    // // // //  MOCK FOR VANILLA REACT. TODO: remove this:
    // // // const contents = {
    // // //     title: "Nardium Headlines Testing",
    // // //     body: {
    // // //         content: [
    // // //             {
    // // //                 endIndex: 1,
    // // //                 sectionBreak: {
    // // //                     sectionStyle: {
    // // //                         columnSeparatorStyle: "NONE",
    // // //                         contentDirection: "LEFT_TO_RIGHT",
    // // //                         sectionType: "CONTINUOUS",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 1,
    // // //                 endIndex: 8,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 1, endIndex: 8, textRun: { content: "H1 - 1\n", textStyle: {} } }],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.opb284gdria0",
    // // //                         namedStyleType: "HEADING_1",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 8,
    // // //                 endIndex: 15,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 8, endIndex: 15, textRun: { content: "H2 - 2\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.6z3v76uflp1r",
    // // //                         namedStyleType: "HEADING_2",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 15,
    // // //                 endIndex: 22,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 15, endIndex: 22, textRun: { content: "H3 - 3\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.i8wwhibh4v7v",
    // // //                         namedStyleType: "HEADING_3",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 22,
    // // //                 endIndex: 29,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 22, endIndex: 29, textRun: { content: "H4 - 4\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.jg2jpfu79bzz",
    // // //                         namedStyleType: "HEADING_4",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 29,
    // // //                 endIndex: 36,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 29, endIndex: 36, textRun: { content: "H1 - 5\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.ux7bmvz95wyy",
    // // //                         namedStyleType: "HEADING_1",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 36,
    // // //                 endIndex: 43,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 36, endIndex: 43, textRun: { content: "H2 - 6\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.i6zu16fw3tuj",
    // // //                         namedStyleType: "HEADING_2",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 43,
    // // //                 endIndex: 50,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 43, endIndex: 50, textRun: { content: "H3 - 7\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.vbp8nl9eg1s",
    // // //                         namedStyleType: "HEADING_3",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 50,
    // // //                 endIndex: 57,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 50, endIndex: 57, textRun: { content: "H4 - 8\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.2x3fvugxehv6",
    // // //                         namedStyleType: "HEADING_4",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 57,
    // // //                 endIndex: 64,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 57, endIndex: 64, textRun: { content: "H5 - 9\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.dyh4t2z0z770",
    // // //                         namedStyleType: "HEADING_5",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 64,
    // // //                 endIndex: 72,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 64, endIndex: 72, textRun: { content: "H2 - 10\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.2jd7ibwmaahh",
    // // //                         namedStyleType: "HEADING_2",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 72,
    // // //                 endIndex: 80,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 72, endIndex: 80, textRun: { content: "H1 - 11\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.gd6zllnwyt32",
    // // //                         namedStyleType: "HEADING_1",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 80,
    // // //                 endIndex: 88,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 80, endIndex: 88, textRun: { content: "H2 - 12\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.2pt74a6zl0ii",
    // // //                         namedStyleType: "HEADING_2",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 88,
    // // //                 endIndex: 96,
    // // //                 paragraph: {
    // // //                     elements: [
    // // //                         { startIndex: 88, endIndex: 96, textRun: { content: "H1 - 13\n", textStyle: {} } },
    // // //                     ],
    // // //                     paragraphStyle: {
    // // //                         headingId: "h.b70vuc8fttbq",
    // // //                         namedStyleType: "HEADING_1",
    // // //                         direction: "LEFT_TO_RIGHT",
    // // //                     },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 96,
    // // //                 endIndex: 97,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 96, endIndex: 97, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 97,
    // // //                 endIndex: 98,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 97, endIndex: 98, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 98,
    // // //                 endIndex: 99,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 98, endIndex: 99, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 99,
    // // //                 endIndex: 100,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 99, endIndex: 100, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 100,
    // // //                 endIndex: 101,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 100, endIndex: 101, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 101,
    // // //                 endIndex: 102,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 101, endIndex: 102, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 102,
    // // //                 endIndex: 103,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 102, endIndex: 103, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 103,
    // // //                 endIndex: 104,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 103, endIndex: 104, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 104,
    // // //                 endIndex: 105,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 104, endIndex: 105, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //             {
    // // //                 startIndex: 105,
    // // //                 endIndex: 106,
    // // //                 paragraph: {
    // // //                     elements: [{ startIndex: 105, endIndex: 106, textRun: { content: "\n", textStyle: {} } }],
    // // //                     paragraphStyle: { namedStyleType: "NORMAL_TEXT", direction: "LEFT_TO_RIGHT" },
    // // //                 },
    // // //             },
    // // //         ],
    // // //     },
    // // //     documentStyle: {
    // // //         background: { color: {} },
    // // //         pageNumberStart: 1,
    // // //         marginTop: { magnitude: 72, unit: "PT" },
    // // //         marginBottom: { magnitude: 72, unit: "PT" },
    // // //         marginRight: { magnitude: 72, unit: "PT" },
    // // //         marginLeft: { magnitude: 72, unit: "PT" },
    // // //         pageSize: { height: { magnitude: 792, unit: "PT" }, width: { magnitude: 612, unit: "PT" } },
    // // //         marginHeader: { magnitude: 36, unit: "PT" },
    // // //         marginFooter: { magnitude: 36, unit: "PT" },
    // // //         useCustomHeaderFooterMargins: true,
    // // //     },
    // // //     namedStyles: {
    // // //         styles: [
    // // //             {
    // // //                 namedStyleType: "NORMAL_TEXT",
    // // //                 textStyle: {
    // // //                     bold: false,
    // // //                     italic: false,
    // // //                     underline: false,
    // // //                     strikethrough: false,
    // // //                     smallCaps: false,
    // // //                     backgroundColor: {},
    // // //                     foregroundColor: { color: { rgbColor: {} } },
    // // //                     fontSize: { magnitude: 11, unit: "PT" },
    // // //                     weightedFontFamily: { fontFamily: "Arial", weight: 400 },
    // // //                     baselineOffset: "NONE",
    // // //                 },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     alignment: "START",
    // // //                     lineSpacing: 115,
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spacingMode: "COLLAPSE_LISTS",
    // // //                     spaceAbove: { unit: "PT" },
    // // //                     spaceBelow: { unit: "PT" },
    // // //                     borderBetween: {
    // // //                         color: {},
    // // //                         width: { unit: "PT" },
    // // //                         padding: { unit: "PT" },
    // // //                         dashStyle: "SOLID",
    // // //                     },
    // // //                     borderTop: {
    // // //                         color: {},
    // // //                         width: { unit: "PT" },
    // // //                         padding: { unit: "PT" },
    // // //                         dashStyle: "SOLID",
    // // //                     },
    // // //                     borderBottom: {
    // // //                         color: {},
    // // //                         width: { unit: "PT" },
    // // //                         padding: { unit: "PT" },
    // // //                         dashStyle: "SOLID",
    // // //                     },
    // // //                     borderLeft: {
    // // //                         color: {},
    // // //                         width: { unit: "PT" },
    // // //                         padding: { unit: "PT" },
    // // //                         dashStyle: "SOLID",
    // // //                     },
    // // //                     borderRight: {
    // // //                         color: {},
    // // //                         width: { unit: "PT" },
    // // //                         padding: { unit: "PT" },
    // // //                         dashStyle: "SOLID",
    // // //                     },
    // // //                     indentFirstLine: { unit: "PT" },
    // // //                     indentStart: { unit: "PT" },
    // // //                     indentEnd: { unit: "PT" },
    // // //                     keepLinesTogether: false,
    // // //                     keepWithNext: false,
    // // //                     avoidWidowAndOrphan: true,
    // // //                     shading: { backgroundColor: {} },
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "HEADING_1",
    // // //                 textStyle: { fontSize: { magnitude: 20, unit: "PT" } },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { magnitude: 20, unit: "PT" },
    // // //                     spaceBelow: { magnitude: 6, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "HEADING_2",
    // // //                 textStyle: { bold: false, fontSize: { magnitude: 16, unit: "PT" } },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { magnitude: 18, unit: "PT" },
    // // //                     spaceBelow: { magnitude: 6, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "HEADING_3",
    // // //                 textStyle: {
    // // //                     bold: false,
    // // //                     foregroundColor: {
    // // //                         color: { rgbColor: { red: 0.2627451, green: 0.2627451, blue: 0.2627451 } },
    // // //                     },
    // // //                     fontSize: { magnitude: 14, unit: "PT" },
    // // //                 },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { magnitude: 16, unit: "PT" },
    // // //                     spaceBelow: { magnitude: 4, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "HEADING_4",
    // // //                 textStyle: {
    // // //                     foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
    // // //                     fontSize: { magnitude: 12, unit: "PT" },
    // // //                 },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { magnitude: 14, unit: "PT" },
    // // //                     spaceBelow: { magnitude: 4, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "HEADING_5",
    // // //                 textStyle: {
    // // //                     foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
    // // //                     fontSize: { magnitude: 11, unit: "PT" },
    // // //                 },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { magnitude: 12, unit: "PT" },
    // // //                     spaceBelow: { magnitude: 4, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "HEADING_6",
    // // //                 textStyle: {
    // // //                     italic: true,
    // // //                     foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
    // // //                     fontSize: { magnitude: 11, unit: "PT" },
    // // //                 },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { magnitude: 12, unit: "PT" },
    // // //                     spaceBelow: { magnitude: 4, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "TITLE",
    // // //                 textStyle: { fontSize: { magnitude: 26, unit: "PT" } },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { unit: "PT" },
    // // //                     spaceBelow: { magnitude: 3, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //             {
    // // //                 namedStyleType: "SUBTITLE",
    // // //                 textStyle: {
    // // //                     italic: false,
    // // //                     foregroundColor: { color: { rgbColor: { red: 0.4, green: 0.4, blue: 0.4 } } },
    // // //                     fontSize: { magnitude: 15, unit: "PT" },
    // // //                     weightedFontFamily: { fontFamily: "Arial", weight: 400 },
    // // //                 },
    // // //                 paragraphStyle: {
    // // //                     namedStyleType: "NORMAL_TEXT",
    // // //                     direction: "LEFT_TO_RIGHT",
    // // //                     spaceAbove: { unit: "PT" },
    // // //                     spaceBelow: { magnitude: 16, unit: "PT" },
    // // //                     keepLinesTogether: true,
    // // //                     keepWithNext: true,
    // // //                     pageBreakBefore: false,
    // // //                 },
    // // //             },
    // // //         ],
    // // //     },
    // // //     revisionId: "ANeT5PQlsUDwq3soyg43Z1ryEgbH-MeWooo8R-swFY24aWKPhc9cOoKFGx8POPTXM5nyPMJp5Lj_2Bd5f2N3Xw",
    // // //     suggestionsViewMode: "SUGGESTIONS_INLINE",
    // // //     documentId: "1fMp6Wfal8e-AMH5F5gj-wscCFpYFp6CXMwrcZIFyatw",
    // // // };
    // // // documentCtx.updateDocumentDetails({ documentContent: contents } as DocumentInfo);
    // // // filterDocumentContent(contents);
    // // // return;

    try {
        const { token } = documentCtx.documentDetails;

        console.log("trying with these token/documentId,", !!token, !!documentId);

        if (token && documentId) {
            console.log("going wid deeze", token, "\n/////\n", documentId);
            console.log("4)");

            return fetch("https://docs.googleapis.com/v1/documents/" + documentId, {
                method: "GET",
                headers: new Headers({ Authorization: "Bearer " + token }),
            })
                .then(res => {
                    const response = res.json();
                    return response;
                })
                .then(contents => {
                    console.log("docs API call response (content)", JSON.stringify(contents));
                    documentCtx.updateDocumentDetails({ documentContent: contents } as DocumentInfo);
                    return contents as UnfilteredBody;
                });
        } else {
            console.log("No authToken or google docs documentId found");
            return Promise.resolve(undefined);
        }
    } catch (e) {
        console.log("Error in request to fetch document body:\n", e);
        return Promise.resolve(undefined);
    }
};