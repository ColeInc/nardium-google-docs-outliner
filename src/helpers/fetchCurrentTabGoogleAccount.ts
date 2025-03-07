// export const fetchCurrentTabGoogleAccount = (): string => {
//   try {
//     // Find the email address within the "gb_zc" div on google docs webpage:
//     const element = document.querySelector('.gb_zc');

//     if (element) {
//       const accountInfoDiv = element.querySelector('div:nth-child(3)');

//       if (accountInfoDiv) {
//         const email = accountInfoDiv.textContent?.trim() ?? '';
//         // console.log("Extracted dis email address:", email);
//         return email;
//       } else {
//         console.log('Email address div not found within "gb_wc" div :(');
//         return '';
//       }
//     } else {
//       return '';
//     }
//   } catch (error) {
//     console.log("failed to fetch user's email address", error);
//     return '';
//   }
// };
export const fetchCurrentTabGoogleAccount = (): string => {
  try {
    const html = document.body.innerHTML;
    // Create a DOM parser to work with the HTML
    const parser = new DOMParser();
    const doc = parser.parseFromString(html, 'text/html');

    // Find all elements with aria-label attributes
    const elementsWithAriaLabel = doc.querySelectorAll('[aria-label]');

    // Look for the specific format in Google account aria-labels
    for (const element of Array.from(elementsWithAriaLabel)) {
      const ariaLabel = element.getAttribute('aria-label');

      // Check if this is a Google account aria-label (contains "Google Account:" and an email)
      if (ariaLabel && ariaLabel.includes('Google Account:')) {
        // Use regex to extract the email address
        const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
        const match = ariaLabel.match(emailRegex);

        if (match) {
          return match[0]; // Return the first email match
        }
      }
    }

    // Return empty string if no email was found
    return '';
  } catch (error) {
    console.log("failed to fetch user's email address", error);
    return '';
  }
};
