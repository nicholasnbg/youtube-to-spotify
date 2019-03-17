import axios from "axios";
import cheerio from "cheerio";

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

async function getVideoDescription(html) {
  const $ = cheerio.load(html);
  const desc = $("#eow-description").html();
  const trackLines = desc.split("</a>");
  trackLines.shift();

  const tracks = trackLines.map(line => {
    const parts = line.split(/- | &#x2013;/);
    const artist = parts[0];
    const track = parts[1].split("<br>")[0];
    const trackObj = {
      artist,
      track
    };

    return trackObj;
  });

  console.log(tracks);
}

export { getHTML, getVideoDescription };
