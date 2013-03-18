import ch1, imdb, json
import inspect, pprint, time, pickle


f = open('mov_obj.pickle', 'r')

# make empty string if no proxy desired
proxy = "127.0.0.1:9050"

# this will be the final json obj
mov_obj = pickle.load(f)

# get the top 250 movies from the imdb list, add them to the movies object, uncomment line to build obj
# imdb.get_top250(mov_obj)


# get 1channel details
log = open('log.txt', 'w+')
counter = 1
for m in mov_obj:
    # get 1channel info
    print "Attempting movie", str(counter) + ":", str(m) + "........"
    
    ch1.get_1ch_details(m, mov_obj, proxy)
    # print "OK!"
    # log.write(m)
    counter += 1
    time.sleep(10)



## prints out the mov_obj for debugging purposes using prettyprint.
def pp():
    pprint.pprint((mov_obj))

#ch1.get_search_string()










# f.close()