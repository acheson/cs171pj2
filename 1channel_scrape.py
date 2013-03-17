import ch1, imdb, json, inspect, pprint, time


f = open('test.json', 'w')

# make empty string if no proxy desired
proxy = "127.0.0.1:9050"

# this will be the final json obj
mov_obj = {}

# get the top 250 movies from the imdb list, add them to the movies object
imdb.get_top250(mov_obj)



## prints out the mov_obj for debugging purposes using prettyprint.
def pp():
    pprint.pprint((mov_obj))

#ch1.get_search_string()










f.close()