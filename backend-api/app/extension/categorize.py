from typing import List
from dotenv import load_dotenv
from openai import OpenAI
import requests
from bs4 import BeautifulSoup
from urllib.parse import urlparse

load_dotenv()
client = OpenAI()


def get_interest_category(website: str, enabled_categories: List[str]):
    domain = urlparse(website).netloc
    response = requests.get(website)
    soup = BeautifulSoup(response.text, "html.parser")
    soup = soup.prettify()
    soup = soup.replace("\n", "")
    soup = soup.replace("\t", "")
    soup = soup.replace("  ", "")
    soup = soup.replace("   ", "")
    soup = soup.replace("    ", "")
    soup = soup.replace("     ", "")
    soup = soup.replace("      ", "")
    soup = soup.replace("       ", "")

    # Get the title of the website
    title = ""
    try:
        title = soup.split("<title>")[1].split("</title>")[0]
    except:
        pass

    # Get the headings of the website, safely, sometimes there are no headings
    headings = ""
    try:
        headings = soup.split("<h1>")[1].split("</h1>")[0]
    except:
        pass

    # Get the navigation bar of the website
    nav_bar = ""
    try:
        nav_bar = soup.split("<nav>")[1].split("</nav>")[0]
    except:
        pass

    # Get any other information that can be helpful for classification
    other_information = ""
    try:
        other_information = soup.split("<p>")[1].split("</p>")[0]
    except:
        pass

    website_information_for_classification = (
        "domain: " + domain + " " + title + headings + nav_bar + other_information
    )

    QUERY = (
        "You are a website classifier. You are categorizing websites into the categories of:"
        f"{', '.join(enabled_categories)}."
        "You will be given content from the HEAD request of the page as well as some of the content on the page"
        "and you will be determining what category it is. You will be provided some website content now."
        f"Answer me in either: {', '.join(enabled_categories)}"
    )

    completion = client.chat.completions.create(
        model="gpt-4-1106-preview",
        messages=[
            {"role": "system", "content": QUERY},
            {"role": "user", "content": website_information_for_classification},
        ],
    )

    resp = completion.choices[0].message.content

    if not any(resp.startswith(prefix) for prefix in enabled_categories):
        return None

    return str(completion.choices[0].message.content)
