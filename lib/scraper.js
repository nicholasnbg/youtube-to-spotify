import axios from "axios";
import cheerio from "cheerio";

async function getHTML(url) {
  const { data: html } = await axios.get(url);
  return html;
}

function getVideoDescription(html) {
  const $ = cheerio.load(html);
  const desc = $("#eow-description").html();
  const trackLines = desc.split("</a>");
  trackLines.shift();

  const tracks = trackLines.map(line => {
    const parts = line.split(/- | &#x2013;/);
    const artist = parts[0].trim();
    const title = parts[1].split("<br>")[0].trim();
    const trackObj = {
      artist,
      title
    };

    return trackObj;
  });
  return tracks;
}

export { getHTML, getVideoDescription };
