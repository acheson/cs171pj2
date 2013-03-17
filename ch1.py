from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import abs as abs_url
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import re





# function generates search string with searched movie/show text
def get_search_string(search, proxy):
    url = URL("http://1channel.ch")
    dom = DOM(url.download(cached=False, timeout=20, proxy=proxy))
    a = dom.by_id("searchform")
    s_base = a.attributes.get("action")
    s_text = "_keywords=" + search.replace(" ","+")
    key = a.by_attribute(name="key")[0].attributes.get("value")
    s_section = a.by_attribute(name="search_section")[0].attributes.get("value")
    search_string = s_base + s_text + "&key=" + key + "&search_section=" + s_section
    return search_string



# function uses search string, movie title and movie year to
#  retrieve content page from 1channel.ch
def get_mov_link(search_url, mov_title, mov_year, dl_params):
    mov_url = URL(search_url)
    try:
        mov_dom = DOM(mov_url.download(dl_params))    
    except Exception, e:
        raise "Could not download search url: ", e
    
    mov_ind = mov_dom.by_class("index_container")
    #print search_url
    #print mov_ind[0].by_class("index_item index_item_ie")[0]
    if mov_ind[0].by_class("info_message"):
        print mov_title, "not found"
        return None
    else:
        for r in mov_ind[0].by_class("index_item index_item_ie"):
            #grab the search results title
            res_title = r.by_tag("a")[0].attributes.get("title")

            #split out the year based on "(\d+)", assign title to res_t and year to res_y
            res_ts = re.search("Watch (.+)\s\((\d+)", res_title)
            res_t = res_ts.group(1)
            res_y = res_ts.group(2)
            print res_t, res_y, mov_title, mov_year
            if res_t.strip() == mov_title.strip() and res_y == mov_year:
                return abs_url(r.by_tag("a")[0].attributes.get("href"),base=url.redirect or url.string)