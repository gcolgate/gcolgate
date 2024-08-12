export async function fetchJson(file) {

    let raw = await fetch(file, {
        method: 'GET',
        headers: {
            'Accept': 'application/json',
        },
    });
    return await raw.json();

}
