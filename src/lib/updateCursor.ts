export const updateCursor = (token: string, documentId: string, startIndex: string | undefined) => {
    console.log("deeze 3", token, documentId, startIndex);

    if (token && documentId && startIndex) {
        fetch(`https://docs.googleapis.com/v1/documents/${documentId}:batchUpdate`, {
            method: "PUT",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                requests: [
                    {
                        updateCursor: {
                            location: {
                                index: startIndex,
                            },
                        },
                    },
                ],
            }),
        }).catch(error => console.error(error));
    } else {
        console.log("Invalid token, documentId or startIndex provided.");
    }
};
