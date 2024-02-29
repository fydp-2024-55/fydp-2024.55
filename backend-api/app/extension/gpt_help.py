from dotenv import load_dotenv
from openai import OpenAI
import requests
from bs4 import BeautifulSoup

load_dotenv()
client = OpenAI()

def Get_category(website):
    response = requests.get(website)
    # print(response)
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

    website_information_for_classification = title + headings + nav_bar + other_information

    QUERY = "You are a website classifier. You are categorizing websites into the categories of:" \
            "Shopping, Social Media, travel, entertainment, sports, animal, music, cuisine or beauty websites."\
            "You will be given content from the HEAD request of the page as well as some of the content on the page"\
            "and you will be determining what category it is. You will be provided some website content now."\
            "Answer me in either: SHOP, TRAVEL, ENTERTAINMENT, SOCIAL, SPORTS, ANIMALS, MUSIC, CUISINE, BEAUTY"

    completion = client.chat.completions.create(
    model="gpt-4-1106-preview",
    messages=[
        {"role": "system", "content": QUERY},
        {"role": "user", "content": website_information_for_classification}
    ]
    )

    resp = completion.choices[0].message.content
    CATEGORIES = ['SHOP', 'TRAVEL', 'ENTERTAINMENT', 'SOCIAL']

    if not any(resp.startswith(prefix) for prefix in CATEGORIES):
      return None


    return completion.choices[0].message.content