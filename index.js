import { getHTML, getVideoDescription } from "./lib/scraper";

async function go() {
  getVideoDescription(
    await getHTML("https://www.youtube.com/watch?v=88EFvUmsoJI&t=179s")
  );
}

go();
