import ch1, imdb, json
import inspect, pprint, time, pickle, collections

## prints out the mov_obj for debugging purposes using prettyprint.
def pp():
    pprint.pprint((mov_obj))
f = open('mov_obj_plus6', 'r')
begin = 6
end = 11
# make empty string if no proxy desired
proxy = "127.0.0.1:9050"

# this will be the final json obj
mov_obj = pickle.load(f)
# mov_obj = {}

# get the top 250 movies from the imdb list, add them to the movies object, uncomment line to build obj
# imdb.get_top250(mov_obj)

# create an ordered dictionary ranking movies by ... rank.  Obviously.
# a = collections.OrderedDict(sorted(mov_obj.items(), key=lambda (k,v): v['IMDB']['Rank']))
# for x in a
# get 1channel details
# log = open('log.txt', 'w+')
counter = begin
# for mov in mov_obj[begin:end]:
#     # get 1channel info
#     print "Attempting movie", str(counter) + ":", str(mov['title']) + "........"
    
#     ch1.get_1ch_details(mov['title'], mov, proxy)
# #     # print "OK!"
# #     # log.write(m)
#     counter += 1
#     time.sleep(10)





#ch1.get_search_string()

for mov in mov_obj[(begin-1):end]:
    print "Attempting movie", str(counter) + ":", str(mov['title']) + "........"
    
    ch1.get_1ch_details(mov['title'], mov, proxy)
    counter += 1
    time.sleep(10)








# f.close()