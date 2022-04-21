/**
 * Performs a GET method on the given URL with the fetch function.
 * 
 * @param {string} url - url to fetch from
 * @returns json parsed from the fetched data.
 */
export async function dataFetching( url ) {
    const raw = await fetch( url );
    const { assets } = await raw.json();
    return assets;
}

export async function dataFetchingSingle( url ) {
    const raw = await fetch(url);
    return await raw.json();
}