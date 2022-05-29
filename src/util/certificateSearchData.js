const pageData = {};
const certificatePageData = 'certPageData'

export const setCertificateSearchData = (certPageSearchData) => {
    let params = new URLSearchParams(certPageSearchData);
    params.forEach((value, key) => {
        if (value) {
            pageData[key] = value;
        }
    });

    localStorage.setItem(certificatePageData, JSON.stringify(pageData));
}

export const getCertificateSearchData = () => {
    const certPageDataString = localStorage.getItem(certificatePageData);
    return JSON.parse(certPageDataString);
}

export const removeCertificateSearchData = () => {
    localStorage.removeItem(certificatePageData);
}