from gpt_help import Get_category
from urllib.parse import urlparse
from sample_websites import WEBSITES
import time

for website in WEBSITES:
    domain = urlparse(website).netloc
    category = Get_category(website)
    print(domain, category)
    time.sleep(5)