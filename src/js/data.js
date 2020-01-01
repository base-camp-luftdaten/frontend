// const BASE_URL = 'http://localhost:8080';
const BASE_URL = 'http://basecamp-demos.informatik.uni-hamburg.de:8080/AirDataBackendService';

/**
 * Fetches the data for a specific timestamp
 * @param {number} timestampInSeconds The timestamp in seconds
 * @param {'p10' | 'p25'} type The type of dust to fetch (p10/p25)
 */
export async function getHeatmapForTimestamp(timestampInSeconds, type) {
    const timeout = 8000; // in milliseconds
    const url = `${BASE_URL}/heatmap/?timestamp=${timestampInSeconds}&type=${type}`;

    let timeoutHandler;
    const result = await Promise.race([
        new Promise(async resolve => {
            try {
                const response = await fetch(url);
                const data = await response.json();
                clearTimeout(timeoutHandler);
                return resolve(data);
            } catch (e) {
                console.error(e);
                clearTimeout(timeoutHandler);
                return resolve([]);
            }
        }),
        new Promise(resolve => {
            timeoutHandler = setTimeout(function() {
                console.log(`Timed out: ${url}`);
                resolve([]);
            }, timeout);
        })
    ]);

    return result;
}
