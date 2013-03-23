from pattern.web import URL, DOM, plaintext, strip_between
from pattern.web import abs as abs_url
from pattern.web import NODE, TEXT, COMMENT, ELEMENT, DOCUMENT
import urllib2, urlparse, socket
import re



url = URL("http://1channel.ch")

# function generates search string with searched movie/show text
def get_search_string(search, proxy):
    if search == "Schindler's List":
        search = "Schindler"
    if search == "One Flew Over the Cuckoo's Nest":
        search = "one flew over"
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
def get_mov_link(search_url, mov_title, mov_year, proxy):
    mov_url = URL(search_url)
    #try:
    mov_dom = DOM(mov_url.download(cached=False, timeout=25, proxy=proxy)) 
    #print mov_dom
    #    print "Downloaded search dom for:", mov_title, "(" + str(mov_year) + ")"   
    #except Exception, e:
    #    print "Could not download search url: ", mov_url,'for reason:', e
    
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
            if mov_title == 'The Good, the Bad and the Ugly':
                mov_year = 1967
            if mov_title == 'The Dark Knight':
                mov_title = 'Batman: The Dark Knight'
            if mov_title == "One Flew Over the Cuckoo's Nest":
                mov_year = 1976
            if mov_title == 'Star Wars':
                mov_title ='Star Wars: Episode IV - A New Hope'
            if mov_title == 'Seven Samurai':
                mov_year = 1956
            if mov_title == 'Once Upon a Time in the West':
                mov_title = "Once Upon a Time in the West - (C'era una volta il West)"
            if mov_title == 'Casablanca':
                mov_year = 1943
            print res_t, res_y, mov_title.strip().replace(",",""), mov_year
            if res_t.strip() == mov_title.strip().replace(",","") and int(res_y) == int(mov_year):
                return abs_url(r.by_tag("a")[0].attributes.get("href"),base=url.redirect or url.string)

# gets host ip for 
def get_host_ip(hurl, proxy):
    if hurl.find("http") == -1:
        hurl = "http://" + str(hurl)
    print hurl
    h__url =  urllib2.urlopen(hurl)
    return socket.gethostbyname(urlparse.urlparse(h__url.geturl()).netloc) 

# get the details from the content page, add them to the object
def get_mov_details(murl, m, obj, proxy):
    murl = URL(murl)

    attempt = 1
    print "trying to retrieve", str(murl) + ", attempt: " , attempt
    while attempt < 3:
        try:    
            murl_dom = DOM(murl.download(cached=False, timeout=20, proxy=proxy))
            print "search dom dl successful"
            break
        except Exception, e:
            attempt +=1
            print "attempted failed, trying again (" + str(attempt) + ")"
    
    links = murl_dom.by_class('movie_version*')

    # initialize hosts dictionary
    hosts = {}

    #intiialize onechannel section of object
   # if '1channel' in m: del m['1channel']
    obj['1channel'] = {}

    # get link info by looping through all links on page
    for link in links:
        if link.by_tag('td')[1].by_tag('a')[0].attributes.get('data-id','') == 'trailer':
            continue
        re_host = link.by_tag('td')[2].by_tag('script')[0].content 
        host = re.search("document.writeln\(\'(.+)\'\);", re_host).group(1)

        print "host:", host

        hurl = host

        #if host is hd sponsor, get the url, otherwise the hosts are the hurl
        if host == 'HD Sponsor':
            hurl =  link.by_tag('a')[0].attributes.get('href','')
        # if host is in hosts dictionary, add
        if host not in hosts:
            hosts[host] = get_host_ip(hurl, proxy)
            obj['1channel'][host] = {}
            obj['1channel'][host]['Views'] = int(link.by_class('version_veiws')[0].content[1:-6])
            obj['1channel'][host]['NumLinks'] = 1
            obj['1channel'][host]['IP'] = hosts[host]
            obj['1channel'][host]['Location']= {}
        else:
            obj['1channel'][host]['Views'] += int(link.by_class('version_veiws')[0].content[1:-6])
            obj['1channel'][host]['NumLinks'] +=1
            obj['1channel'][host]['IP'] = hosts[host]


# takes individual movie dictionary from movie object, proxy as input
# adds 1ch details to entry for obj
def get_1ch_details(m, obj, proxy):
    
    s = get_search_string(m, proxy)
    print s
    
    d = get_mov_link(s, m, obj['IMDB']['Year'], proxy)
    
    

    get_mov_details(d, m, obj, proxy)
    print "Grabbed info"
    