import axios from "axios";

export async function downloadImage(url: string) {
    const res = await axios.get(url, { responseType: 'arraybuffer' } );

    return Buffer.from( res.data )
}