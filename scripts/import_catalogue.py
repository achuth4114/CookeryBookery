"""Join a browser-saved MyCookingList page to the existing Jekyll recipe tags."""

import argparse
import json
import re
from html import unescape
from html.parser import HTMLParser
from pathlib import Path
from urllib.parse import parse_qs, urlencode, urlsplit, urlunsplit


class VideoTitle(HTMLParser):
    def __init__(self, row):
        super().__init__()
        self.title = None
        self.url = None
        self.feed(row)

    def handle_starttag(self, tag, attributes):
        attributes = dict(attributes)
        if tag == "a" and attributes.get("id") == "video-title":
            self.title = attributes["title"]
            self.url = attributes["href"]


def draft_tags(repo):
    tags = {}
    for path in (repo / "recipes").glob("*.md"):
        front_matter = path.read_text(encoding="utf-8").split("---", 2)[1]
        fields = dict(re.findall(r"^(video_id|meals|cuisines|tastes): (.+)$", front_matter, re.M))
        video_id = fields.pop("video_id")
        if video_id in tags:
            raise ValueError(f"Duplicate recipe in repository: {video_id}")
        tags[video_id] = {key: json.loads(value) for key, value in fields.items()}
    return tags


def import_catalogue(source, repo):
    html = source.read_text(encoding="utf-8")
    rows = re.findall(r"<ytd-playlist-video-renderer\b.*?</ytd-playlist-video-renderer>", html, re.S)
    tags = draft_tags(repo)
    recipes = []
    ids = set()

    for row in rows:
        video = VideoTitle(row)
        if video.url is None:
            continue
        url = urlsplit(video.url)
        query = parse_qs(url.query)
        video_id, = query.get("v", [])
        if url.scheme != "https" or url.hostname != "www.youtube.com" or url.path != "/watch":
            raise ValueError(f"Unexpected original video URL: {video.url}")
        if video_id in ids or not re.fullmatch(r"[\w-]{11}", video_id, re.ASCII):
            raise ValueError(f"Duplicate or invalid saved video: {video_id}")
        ids.add(video_id)

        # Keep the creator's video and its timestamp without exposing the source playlist.
        public_query = {"v": video_id}
        if timestamps := query.get("t"):
            public_query["t"] = timestamps[0]
        watch_url = urlunsplit((url.scheme, url.netloc, url.path, urlencode(public_query), ""))

        channel = re.search(r'<ytd-channel-name\b.*?<yt-formatted-string\b[^>]*?\btitle="([^"]+)"', row, re.S)
        duration = re.search(r'class="ytBadgeShapeText"[^>]*>\s*([\d:]+)\s*</div>', row)
        recipes.append({
            "id": video_id,
            "title": video.title,
            "url": watch_url,
            "channel": unescape(channel[1]) if channel else "",
            "duration": duration[1] if duration else "",
            **tags.get(video_id, {"meals": [], "cuisines": [], "tastes": []}),
        })

    if not recipes:
        raise ValueError("The saved HTML contained no recipe links")
    if missing := tags.keys() - ids:
        raise ValueError(f"Saved HTML is missing {len(missing)} videos from the GitHub draft")

    total_match = re.search(r'"content":"([\d,]+) videos"', html)
    playlist_count = int(total_match[1].replace(",", "")) if total_match else None
    return {"playlistCount": playlist_count, "recipes": recipes}


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument("saved_html", type=Path)
    parser.add_argument("--output", type=Path, default=Path("catalogue.json"))
    args = parser.parse_args()
    catalogue = import_catalogue(args.saved_html, Path(__file__).resolve().parents[1])
    args.output.write_text(json.dumps(catalogue, ensure_ascii=False, indent=2) + "\n", encoding="utf-8")
    print(f"{len(catalogue['recipes'])} visible videos imported from {catalogue['playlistCount']} playlist entries")
